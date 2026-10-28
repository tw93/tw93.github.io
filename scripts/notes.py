#!/usr/bin/env python3
"""Build the notes archive offline; network access is opt-in per subcommand."""
import argparse
import concurrent.futures
import collections
import datetime as dt
import html
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'data/x/posts.json'
META = ROOT / 'scripts/notes'
OUTPUT = ROOT / '_data/notes.json'
MIRROR = ROOT / 'data/x/mirror'
CATEGORIES = {'ai', 'tools', 'learn', 'make', 'think', 'life'}
TCO = re.compile(r'https?://t\.co/[A-Za-z0-9]+')
MENTIONS = re.compile(r'^\s*(?:@[A-Za-z0-9_]+\s*)+')
HASHTAG = re.compile(r'(?<![\w/#])#([^\W#]+)', re.UNICODE)
UA = 'Mozilla/5.0'
SHORTENERS = {'t.co', 'bit.ly', 'bitly.com', 't.cn', 'dwz.cn', 'dwz.com', 'tinyurl.com', 'goo.gl', 'buff.ly', 'ow.ly', 'is.gd', 'v.gd', 'trib.al', 'rebrand.ly', 'shorturl.at', 'lnkd.in', 'suo.im', 'url.cn', 'u.jd.com', 's.click.taobao.com', 'amzn.to', 'youtu.be'}


def read_json(path, default=None):
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else default


def write_map(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, sort_keys=True, indent=1) + '\n', encoding='utf-8')


def full_text(post):
    return html.unescape((post.get('note_tweet') or {}).get('text', post['text']))


def reference(post, kind):
    return next((r for r in post.get('referenced', []) if r['type'] == kind), None)


def replying(post):
    # About 430 older records are replies exported with is_reply false and no
    # referenced entry; the leading @mention is the only trace left.
    return post['is_reply'] or (not post.get('referenced') and MENTIONS.match(full_text(post)) is not None)


def own_words(post):
    text = full_text(post)
    return MENTIONS.sub('', text) if replying(post) else text


def select(posts):
    """Resolve reply ancestry by archived IDs, never by conversation_id/lang."""
    by_id = {p['id']: p for p in posts}
    if len(by_id) != len(posts):
        raise ValueError('Duplicate raw tweet IDs')
    # Every archived record belongs to the author. References to those IDs
    # identify his author_id, including self replies to missing archive records.
    authors = {r.get('author_id') for p in posts for r in p.get('referenced', []) if r['id'] in by_id}
    authors.discard(None)
    self_parent = {}
    heads = {}
    for p in posts:
        r = reference(p, 'replied_to') if p['is_reply'] else None
        if r and (r['id'] in by_id or r.get('author_id') in authors):
            self_parent[p['id']] = r['id']
        elif not replying(p) or ((p.get('metrics') or {}).get('like', 0) >= 10 and len(TCO.sub('', own_words(p)).strip()) >= 10):
            heads[p['id']] = p
    threads = collections.defaultdict(list)
    for pid in self_parent:
        cur, seen = pid, set()
        while cur in self_parent:
            if cur in seen:
                raise ValueError('Cycle in self reply chain: ' + pid)
            seen.add(cur)
            cur = self_parent[cur]
        if cur in heads:
            threads[cur].append(by_id[pid])
    for items in threads.values():
        items.sort(key=lambda p: (date(p), int(p['id'])))
    return sorted(heads.values(), key=lambda p: (date(p), int(p['id'])), reverse=True), dict(threads)


def date(post):
    return dt.datetime.fromisoformat(post['created_at'].replace('Z', '+00:00')).astimezone(dt.timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')


def all_used(heads, threads):
    return [p for h in heads for p in [h] + threads.get(h['id'], [])]


def status_id(url):
    p = urllib.parse.urlsplit(url)
    if (p.hostname or '').lower().removeprefix('www.').removeprefix('mobile.') not in {'x.com', 'twitter.com'}:
        return None
    m = re.fullmatch(r'/(?:[^/]+/status|i/(?:web/)?status)/(\d+)(?:/(?:photo|video)/\d+)?/?', p.path)
    return m.group(1) if m else None


def clean(post, resolved):
    quoted = reference(post, 'quoted')
    links = []
    def replace(match):
        short = match.group()
        target = resolved.get(short)
        if target:
            p = urllib.parse.urlsplit(target)
            sid = status_id(target)
            if sid and (re.search(r'/(?:photo|video)/\d+/?$', p.path) or (quoted and sid == quoted['id'])):
                return ''
        target = target or short
        if target not in links:
            links.append(target)
        return target
    text = TCO.sub(replace, own_words(post))
    text = '\n'.join(line.rstrip() for line in text.splitlines()).rstrip()
    return re.sub(r'\n{3,}', '\n\n', text), links


def language(text):
    if re.search(r'[\u3040-\u30ff\u31f0-\u31ff\uff66-\uff9f]', text):
        return 'ja'
    if re.search(r'[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\U00020000-\U000323af]', text):
        return 'zh'
    return 'en' if re.search(r'[A-Za-z\u00c0-\u024f]', text) else 'und'


def photo_url(url):
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit((p.scheme, p.netloc, p.path, 'format=jpg&name=large', ''))


def media(post, mirrored):
    result = []
    for m in post.get('media', []):
        key = m['media_key']
        if not re.fullmatch(r'[A-Za-z0-9_-]+', key):
            raise ValueError('Unsafe media key')
        typ = {'photo': 'photo', 'video': 'video', 'animated_gif': 'gif'}[m['type']]
        hosted = f'https://cdn.tw93.fun/notes/{key}.jpg' if key in mirrored or key + '.jpg' in mirrored else None
        item = {'type': typ, 'src': (hosted or photo_url(m['url'])) if typ == 'photo' else post['url']}
        for raw, dest in [('width', 'w'), ('height', 'h')]:
            if m.get(raw) is not None:
                item[dest] = m[raw]
        if typ != 'photo':
            if hosted or m.get('preview_image_url'):
                item['poster'] = hosted or m['preview_image_url']
            if typ == 'video' and m.get('duration_ms') is not None:
                item['duration'] = m['duration_ms'] // 1000
        result.append(item)
    return result


def build_notes(heads, threads, categories, resolved, mirrored):
    missing = [p['id'] for p in heads if categories.get(p['id']) not in CATEGORIES]
    if missing:
        raise ValueError(f'{len(missing)} included notes lack a valid category: ' + ', '.join(missing[:20]))
    for hid, items in threads.items():
        for p in items:
            if categories.get(p['id']) != categories[hid]:
                raise ValueError(f'Thread {p["id"]} must inherit category of {hid}')
    included = {p['id'] for p in all_used(heads, threads)}
    result = []
    for p in heads:
        pid = p['id']
        text, links = clean(p, resolved)
        q = reference(p, 'quoted')
        kind = 'reply' if replying(p) else 'quote' if q else 'post'
        n = {'id': pid, 'url': p['url'], 'date': date(p), 'kind': kind, 'lang': language(text), 'category': categories[pid], 'text': text}
        tags = list(dict.fromkeys(HASHTAG.findall(text)))
        if tags:
            n['tags'] = tags
        if links:
            n['links'] = links
        images = media(p, mirrored)
        if images:
            n['media'] = images
        if pid in threads:
            n['thread'] = []
            for t in threads[pid]:
                words, urls = clean(t, resolved)
                entry = {'id': t['id'], 'date': date(t), 'text': words}
                if urls:
                    entry['links'] = urls
                images_t = media(t, mirrored)
                if images_t:
                    entry['media'] = images_t
                n['thread'].append(entry)
        if q:
            n['quote'] = {'url': 'https://x.com/i/status/' + q['id']}
            if q['id'] in included:
                n['quote']['id'] = q['id']
        if kind == 'reply':
            r = reference(p, 'replied_to')
            mention = re.match(r'^\s*@([A-Za-z0-9_]+)', full_text(p))
            target = {}
            if mention:
                target['user'] = mention.group(1)
            if r:
                target['url'] = 'https://x.com/i/status/' + r['id']
            elif mention:
                target['url'] = 'https://x.com/' + mention.group(1)
            if target:
                n['reply_to'] = target
        raw_metrics = p.get('metrics') or {}
        n['metrics'] = {k: raw_metrics.get('impression' if k == 'view' else k, 0) or 0 for k in ['like', 'reply', 'repost', 'quote', 'bookmark', 'view']}
        n['long'] = p.get('note_tweet') is not None or len(text) > 280
        n['thin'] = len(text) < 20 and not any(n.get(k) for k in ['media', 'thread', 'quote'])
        result.append(n)
    return result


def validate(notes):
    def require(ok, message):
        if not ok:
            raise ValueError(message)
    def url(value):
        return isinstance(value, str) and urllib.parse.urlsplit(value).scheme in {'http', 'https'} and bool(urllib.parse.urlsplit(value).netloc)
    def date_ok(value):
        return isinstance(value, str) and re.fullmatch(r'\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ', value) and dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
    def content(n, thread=False):
        require(isinstance(n, dict) and isinstance(n.get('id'), str) and n['id'].isdigit(), 'Invalid ID')
        require(date_ok(n.get('date')), 'Invalid date: ' + n['id'])
        require(isinstance(n.get('text'), str), 'Invalid text')
        require(not any(v is None or v == [] or v == {} or v == '' for k, v in n.items() if k != 'text'), 'Empty optional field: ' + n['id'])
        for key in ['links', 'tags']:
            if key in n:
                require(isinstance(n[key], list) and len(set(n[key])) == len(n[key]) and all(isinstance(v, str) and v for v in n[key]), 'Invalid ' + key)
        require(all(url(v) for v in n.get('links', [])), 'Invalid link')
        for m in n.get('media', []):
            require(set(m) <= {'type', 'src', 'w', 'h', 'poster', 'duration'} and m.get('type') in {'photo', 'video', 'gif'} and url(m.get('src')), 'Invalid media')
            require(all(type(m[k]) is int and m[k] >= 0 for k in ['w', 'h', 'duration'] if k in m), 'Invalid media dimensions/duration')
            require(m['type'] == 'video' or 'duration' not in m, 'Duration on non-video')
            require(m['type'] == 'photo' or url(m.get('poster')), 'Missing poster')
            require(m['type'] != 'photo' or 'poster' not in m, 'Poster on photo')
        if thread:
            require(set(n) <= {'id', 'date', 'text', 'links', 'media'}, 'Invalid thread fields')
    require(isinstance(notes, list), 'Output is not an array')
    seen = set()
    last = None
    for n in notes:
        content(n)
        require(set(n) <= {'id', 'url', 'date', 'kind', 'lang', 'category', 'tags', 'text', 'links', 'media', 'thread', 'quote', 'reply_to', 'metrics', 'long', 'thin'}, 'Unknown note fields')
        require(url(n.get('url')), 'Invalid note URL')
        require(n.get('kind') in {'post', 'quote', 'reply'} and n.get('lang') in {'zh', 'en', 'ja', 'und'} and n.get('category') in CATEGORIES, 'Invalid enum')
        require(type(n.get('long')) is bool and type(n.get('thin')) is bool, 'Missing booleans')
        require(set(n.get('metrics', {})) == {'like', 'reply', 'repost', 'quote', 'bookmark', 'view'} and all(type(v) is int and v >= 0 for v in n['metrics'].values()), 'Invalid metrics')
        require(n['thin'] == (len(n['text']) < 20 and not any(n.get(k) for k in ['media', 'thread', 'quote'])), 'Invalid thin')
        require(n['lang'] == language(n['text']), 'Invalid language')
        require(n.get('tags', []) == list(dict.fromkeys(HASHTAG.findall(n['text']))), 'Invalid hashtags')
        require(n['id'] not in seen, 'Duplicate note')
        seen.add(n['id'])
        current = (n['date'], int(n['id']))
        require(last is None or current <= last, 'Notes are not newest first')
        last = current
        for key in ['quote', 'reply_to']:
            if key in n:
                require(isinstance(n[key], dict) and set(n[key]) <= ({'url', 'id'} if key == 'quote' else {'user', 'url'}), 'Invalid ' + key)
                require(url(n[key].get('url')), 'Invalid reference URL')
        if 'quote' in n and 'id' in n['quote']:
            require(any(p['id'] == n['quote']['id'] or any(t['id'] == n['quote']['id'] for t in p.get('thread', [])) for p in notes), 'Quote ID is not included')
        previous = None
        for t in n.get('thread', []):
            content(t, True)
            require(t['id'] not in seen and not any(p['id'] == t['id'] for p in notes), 'Duplicate thread ID')
            seen.add(t['id'])
            current = (t['date'], int(t['id']))
            require(previous is None or current >= previous, 'Thread is not chronological')
            previous = current


def summary(notes, used, resolved):
    missing = {u for p in used for u in TCO.findall(full_text(p)) if not resolved.get(u)}
    print(json.dumps({'notes': len(notes), 'kind': dict(collections.Counter(n['kind'] for n in notes)), 'category': dict(sorted(collections.Counter(n['category'] for n in notes).items())), 'year': dict(sorted(collections.Counter(n['date'][:4] for n in notes).items())), 'long': sum(n['long'] for n in notes), 'thin': sum(n['thin'] for n in notes), 'with_media': sum(bool(n.get('media')) for n in notes), 'threads': sum(bool(n.get('thread')) for n in notes), 'continuations': sum(len(n.get('thread', [])) for n in notes), 'unresolved_links': len(missing)}, ensure_ascii=False, indent=1))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def request_location(url):
    opener = urllib.request.build_opener(NoRedirect())
    last = None
    for attempt in range(2):
        for method in ['HEAD', 'GET']:
            try:
                req = urllib.request.Request(url, method=method, headers={'User-Agent': UA})
                with opener.open(req, timeout=10) as response:
                    location = response.headers.get('Location')
                    if location:
                        return urllib.parse.urljoin(url, location), None
                    last = 'no-location'
            except urllib.error.HTTPError as e:
                location = e.headers.get('Location')
                e.close()
                if location and 300 <= e.code < 400:
                    return urllib.parse.urljoin(url, location), None
                last = 'HTTP ' + str(e.code)
            except (OSError, ValueError, urllib.error.URLError) as e:
                last = type(e).__name__ + ': ' + str(getattr(e, 'reason', e))
    return None, last


def resolve_one(short):
    current = 'https://t.co/' + urllib.parse.urlsplit(short).path.strip('/')
    seen = {current}
    for hop in range(4):
        location, error = request_location(current)
        if error:
            return short, None, error
        p = urllib.parse.urlsplit(location)
        if p.scheme not in {'http', 'https'} or not p.hostname:
            return short, None, 'invalid-location'
        if location in seen:
            return short, None, 'redirect-cycle'
        current = location
        seen.add(current)
        if (p.hostname or '').lower().removeprefix('www.') not in SHORTENERS:
            break
    return short, current, None


def parallel_batches(items, worker):
    """Eight workers; stop before scheduling more work on uniform failures."""
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for offset in range(0, len(items), 8):
            results = list(pool.map(worker, items[offset:offset + 8]))
            yield results
            errors = [r[2] for r in results if r[2]]
            if len(results) >= 2 and len(errors) == len(results) and len(set(errors)) == 1:
                raise RuntimeError('Repeated network failure; stopped: ' + errors[0])


def resolve_links(used):
    path = META / 'links.json'
    cache = read_json(path, {})
    urls = sorted({u for p in used for text in [p['text'], (p.get('note_tweet') or {}).get('text', '')] for u in TCO.findall(html.unescape(text))})
    pending = [u for u in urls if not cache.get(u)]
    attempted = failures = 0
    try:
        for batch in parallel_batches(pending, resolve_one):
            for short, target, error in batch:
                cache[short] = target
                attempted += 1
                failures += bool(error)
            write_map(path, cache)
            if attempted % 200 == 0:
                print(f'Links: {attempted}/{len(pending)}, failures {failures}', flush=True)
    finally:
        write_map(path, cache)
        print(json.dumps({'unique_links': len(urls), 'cached': len(urls) - len(pending), 'attempted': attempted, 'failures': failures, 'unresolved': sum(not cache.get(u) for u in urls), 'unattempted': len(pending) - attempted}), flush=True)


def download_one(job):
    key, url = job
    path = MIRROR / (key + '.jpg')
    last = None
    for attempt in range(2):
        try:
            request = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(request, timeout=10) as response:
                data = response.read()
            if not data.startswith(b'\xff\xd8\xff'):
                raise ValueError('not a JPEG')
            path.write_bytes(data)
            return key, len(data), None
        except (OSError, ValueError, urllib.error.URLError) as e:
            last = type(e).__name__ + ': ' + str(getattr(e, 'reason', e))
    return key, 0, last


def fetch_media(used):
    jobs = {}
    for p in used:
        for m in p.get('media', []):
            key = m['media_key']
            if not re.fullmatch(r'[A-Za-z0-9_-]+', key):
                raise ValueError('Unsafe media key')
            source = m.get('url') if m['type'] == 'photo' else m.get('preview_image_url')
            if not source:
                raise ValueError('Missing media URL: ' + key)
            jobs[key] = photo_url(source)
    MIRROR.mkdir(parents=True, exist_ok=True)
    pending = [(key, url) for key, url in sorted(jobs.items()) if not (MIRROR / (key + '.jpg')).is_file()]
    done = failures = attempted = 0
    try:
        for batch in parallel_batches(pending, download_one):
            for key, size, error in batch:
                attempted += 1
                if error:
                    failures += 1
                    print('Media failed: ' + key + ': ' + error, file=sys.stderr)
                else:
                    done += 1
            if attempted % 200 == 0:
                print(f'Media: {attempted}/{len(pending)}, failures {failures}', flush=True)
    finally:
        files = [MIRROR / (key + '.jpg') for key in jobs if (MIRROR / (key + '.jpg')).is_file()]
        print(json.dumps({'required_files': len(jobs), 'files': len(files), 'MB': round(sum(p.stat().st_size for p in files) / 1_000_000, 2), 'downloaded': done, 'skipped': len(jobs) - len(pending), 'failures': failures, 'unattempted': len(pending) - attempted}), flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', nargs='?', default='build', choices=['build', 'resolve-links', 'fetch-media'])
    parser.add_argument('--check', action='store_true', help='Validate offline output without writing it')
    args = parser.parse_args()
    if args.check and args.command != 'build':
        parser.error('--check is offline and only applies to build')
    posts = read_json(RAW)
    heads, threads = select(posts)
    used = all_used(heads, threads)
    if args.command == 'resolve-links':
        resolve_links(used)
    elif args.command == 'fetch-media':
        fetch_media(used)
    else:
        resolved = read_json(META / 'links.json', {})
        notes = build_notes(heads, threads, read_json(META / 'categories.json', {}), resolved, read_json(META / 'mirrored.json', {}))
        validate(notes)
        if args.check:
            existing = read_json(OUTPUT)
            validate(existing)
            if existing != notes:
                raise ValueError('Output is stale; run build')
        else:
            OUTPUT.parent.mkdir(parents=True, exist_ok=True)
            OUTPUT.write_text('[\n' + ',\n'.join(json.dumps(n, ensure_ascii=False, separators=(',', ':')) for n in notes) + '\n]\n', encoding='utf-8')
        summary(notes, used, resolved)
        if args.check:
            print('Schema and offline rebuild check passed')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, RuntimeError) as error:
        print('Error: ' + str(error), file=sys.stderr)
        sys.exit(1)
