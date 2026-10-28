# Notes sync agent

Rules for the agent that keeps `/notes/` in step with @HiTw93 on X. Read the Notes section of the repository's `AGENTS.md` first; this file is the run book for one sync, and where the two disagree, `AGENTS.md` wins.

One run does exactly this: take the posts published since the last run, mirror their photos, videos and article covers to R2, file each new note under a category, rebuild `_data/notes.json`, push `main`, and confirm the new notes are live on tw93.fun. Nothing else. Do not restyle pages, rewrite old notes, or touch files outside the list under «What a run commits».

## Schedule

Three runs a day, in Beijing time (UTC+8):

| Run | Beijing | UTC cron | Why this time |
|---|---|---|---|
| Morning | 09:30 | `30 1 * * *` | after the 07:00 to 09:00 posting peak |
| Afternoon | 15:30 | `30 7 * * *` | picks up the midday posts |
| Night | 23:30 | `30 15 * * *` | after the 21:00 to 23:00 peak, the busiest of the day |

The night run also refreshes recent metrics (see step 3). A run that finds nothing new exits without a commit. If a run is skipped, the next one simply picks up more, since the starting point is the newest archived id, not the clock. Never run two syncs at once: hold a lock for the whole run and exit if another run holds it.

`.github/workflows/sync-ai-data.yml` also pushes to `main`, at 02:00 UTC and whenever Yobi dispatches it, so every push here is preceded by a rebase onto `origin/main` (step 10).

## What the agent needs

- X API v2 read access (a bearer token) for the user timeline and tweet lookup.
- Cloudflare R2 write access to bucket `tw93` through `wrangler`, with `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` in the environment.
- Push access to `tw93/tw93.github.io` `main`.
- The full raw archive, `data/x/posts.json` (see below).
- Python 3 with Pillow (for `resize-media`), Ruby with Bundler (`bundle exec jekyll build`), Node for `npx wrangler`.

Credentials come from the agent's secret store. Never print them, write them into a file in the repository, put them in a commit, a log line or a URL.

## The raw archive is never committed

`data/` is gitignored and excluded from Jekyll. It once went live at `tw93.fun/data/x/` with 4485 replies written by other people, and on 2026-10-28 the maintainer had pushed history rewritten to take it out again. So:

- Never `git add -f` anything under `data/`, never move raw records into a tracked path, never commit `posts.json`, a media file or an export summary.
- Store only the author's own posts. Do not fetch, store or publish mentions, replies by other people, likes, followers or DMs. A raw record keeps the text of the post it replies to (`referenced[].text`) only because the build needs to know it is a reply; that text is never published.

`build` regenerates every note from `data/x/posts.json`, so the archive must be complete before step 8. The master copy is `posts.json` in the maintainer's Google Drive folder `HiTw93-x-export`. If the agent's workspace does not persist between runs, download it at the start and upload the merged file back at the end of a successful run. Before using it, check it: it is a JSON list, ids are unique, and it holds at least as many records as the last run left (11241 on 2026-10-28). If it is smaller, stop: building from a partial archive would delete notes from the site.

`data/x/mirror/` (downloaded photos and videos) does not need to persist. `fetch-media` and `fetch-videos` skip every key already listed in `scripts/notes/mirrored.json` and `scripts/notes/videos.json`, so a fresh checkout downloads only what is new.

## One run, step by step

### 1. Start clean

```bash
git checkout main
git pull --ff-only origin main
git status --short
```

The run touches only the files under «What a run commits». If any of them is modified before the run starts, stop and report: someone else is editing them. Other dirty files are left exactly as they are, never stashed, reset or cleaned.

### 2. Fetch only what is new

`since_id` is the largest `id` in `data/x/posts.json` (compare as integers). Ask the user timeline for everything after it:

```
GET https://api.x.com/2/users/{user_id}/tweets
  since_id={since_id}
  max_results=100
  tweet.fields=created_at,lang,public_metrics,conversation_id,referenced_tweets,note_tweet,attachments,entities,in_reply_to_user_id
  expansions=attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id
  media.fields=media_key,type,url,preview_image_url,width,height,duration_ms,variants,alt_text
```

- Look up `{user_id}` for `HiTw93` once with `GET /2/users/by/username/HiTw93` and keep it in the agent's own state.
- Follow `meta.next_token` as `pagination_token` until it is absent; one run normally needs a single page.
- Do not pass `exclude`: replies must come back, because self replies become threads and well-liked replies become notes. Pure retweets are not part of the archive; drop any record whose text starts with `RT @` or that has a `retweeted` reference.
- A result with no new posts ends the run with no commit.

### 3. Night run only: refresh recent metrics

Likes keep arriving for a day or two, and a reply only becomes a note once it has 10 likes, so counts read minutes after posting are too low to decide that. On the 23:30 run only, re-read the posts created in the last 72 hours with `GET /2/tweets?ids=…` (100 ids per request, same fields and expansions) and replace their `metrics`. A post that comes back as not found was deleted by the author: remove it from the archive. Never delete anything outside that 72-hour window.

### 4. Convert and merge

Each API tweet becomes one archive record in the existing shape:

| Record field | From the API |
|---|---|
| `id` | `id` (string) |
| `url` | `https://x.com/HiTw93/status/{id}` |
| `created_at` | `created_at`, ISO UTC ending in `.000Z` |
| `text` | `text`, as returned (t.co links kept, they are resolved in step 5) |
| `note_tweet` | `{"text": note_tweet.text}` only when the API returns `note_tweet`; leave the key out otherwise |
| `lang` | `lang` |
| `metrics` | `{"like": like_count, "reply": reply_count, "repost": retweet_count, "quote": quote_count, "bookmark": bookmark_count, "impression": impression_count}` from `public_metrics` |
| `is_reply` | `true` when `referenced_tweets` has a `replied_to`, otherwise `false` |
| `referenced` | one `{"type", "id", "text", "author_id"}` per `referenced_tweets` entry, `text` and `author_id` from `includes.tweets` |
| `conversation_id` | `conversation_id` |
| `media` | one entry per `attachments.media_keys`, from `includes.media`: `media_key`, `type` (`photo`, `video`, `animated_gif`), `url` for photos, `preview_image_url` and `variants` for video and GIF, `width`, `height`, `duration_ms` when given, `alt_text` when given; `[]` when there is none |
| `cover` | `null` |

Merge by `id`: a new id is added, an existing id has its record replaced. Keep the list sorted newest first by integer id, and fail on duplicate ids. Nothing else in the archive changes.

### 5. Resolve links and article cards

```bash
python3 -I scripts/notes.py resolve-links
python3 -I scripts/notes.py fetch-articles
```

`resolve-links` expands every new `t.co` link into `scripts/notes/links.json` and skips links it already knows. `fetch-articles` reads the title, preview and cover of each X Article the author linked, into `scripts/notes/articles.json`, and saves the cover as `data/x/mirror/article_<id>.jpg`; that cover is uploaded and listed in step 6 like any photo. Most of the author's X Articles are also posts on tw93.fun: for each new entry, find the post with the same title, or the post in the same language published within a few days of it, and add its address as `"post": "https://tw93.fun/YYYY-MM-DD/slug.html"` (`/en/YYYY-MM-DD/slug.html` for an English post). The card then opens the blog instead of X, and `build` fails if that post does not exist. Check the title by reading it, not by a keyword: an English title can name another post's subject, as "A Non-Engineer's Guide to Claude Code" does. Leave `post` out when no post matches. If a link fails twice it is left unresolved and shows as `t.co` on the page; report it, do not invent a target.

### 6. Photos

```bash
python3 -I scripts/notes.py fetch-media
python3 -I scripts/notes.py resize-media
```

`fetch-media` downloads each new photo, and the poster of each new video or GIF, as `data/x/mirror/<media_key>.jpg`, asking X for `format=jpg&name=large`, and rejects anything that is not a JPEG. `resize-media` (needs Pillow) then writes two WebP copies of every JPEG in `data/x/mirror/`, the article covers from step 5 included, as `data/x/mirror/680/<media_key>.webp` and `data/x/mirror/1200/<media_key>.webp`, skipping copies that already exist. The page shows those two copies and opens the JPEG only in the lightbox. Then, for each new key, in this order:

1. Upload the JPEG and both copies:

   ```bash
   npx -y wrangler r2 object put \
     "tw93/notes/<media_key>.jpg" --file "data/x/mirror/<media_key>.jpg" \
     --content-type image/jpeg \
     --cache-control "public, max-age=31536000, immutable" --remote
   for w in 680 1200; do
     npx -y wrangler r2 object put \
       "tw93/notes/$w/<media_key>.webp" --file "data/x/mirror/$w/<media_key>.webp" \
       --content-type image/webp \
       --cache-control "public, max-age=31536000, immutable" --remote
   done
   ```

2. Read all three back: `curl -sI https://cdn.tw93.fun/notes/<media_key>.jpg` must return `200` with `content-type: image/jpeg`, and `https://cdn.tw93.fun/notes/680/<media_key>.webp` and `…/1200/<media_key>.webp` `200` with `content-type: image/webp`. Do not request any of these addresses before its upload: Cloudflare caches the 404 and keeps serving it after the file exists.
3. Only then add `<media_key>` to `scripts/notes/mirrored.json`, which stays a sorted list without duplicates.

Never list a key before its upload is confirmed: a listed key is served from `cdn.tw93.fun`, and a missing file there is a broken image. An unlisted key is still shown, from `pbs.twimg.com`, which works everywhere except mainland China, and the next run tries it again. Three old photos (`3_2005634251358969856`, `3_1613577620171653120`, `3_1612841171923111937`) have failed to download since the first import; their failure is expected and does not fail the run.

Upload the JPEG exactly as `fetch-media` saved it, and make the copies only with `resize-media`; do not crop, watermark or convert anything by hand. Never point the page at `cdn.tw93.fun/cdn-cgi/image/…`: those resizes count against Cloudflare's monthly allowance, which the notes alone outgrow, and every one past it is a broken image. The `width`/`height` from X reserve the box before the image arrives.

### 7. Videos and GIFs

```bash
python3 -I scripts/notes.py fetch-videos
```

It downloads the sharpest MP4 whose short side is at most 720px as `data/x/mirror/video/<media_key>.mp4` and rejects anything that is not an MP4. Upload each new file the same way as a photo, with `--content-type video/mp4` and the path `tw93/notes/<media_key>.mp4`, read it back (`200`, `content-type: video/mp4`), then add the key to `scripts/notes/videos.json`, a sorted list without duplicates. An unlisted video shows its poster linking to X until a later run uploads it. Do not transcode.

### 8. Categories

Every new note needs a category in `scripts/notes/categories.json` (note id to category), or `build` fails. Run `python3 -I scripts/notes.py build`; when it stops with `N included notes lack a valid category`, the ids it lists are the to-do list.

| Key | Shown as | Use for |
|---|---|---|
| `make` | 产品 | the author's own products and their releases, users, sales and support: Mole, Kaku, Pake, MiaoYan, Hina, Kami, 潮流周刊 (Weekly), Waza and the rest |
| `ai` | AI | models, agents, AI coding tools, the AI industry, when the subject is not one of his products |
| `tools` | 工具 | software, apps, devices and tips he found or recommends, made by others |
| `learn` | 学习 | how-tos, technical write-ups, explanations, reading and course notes |
| `think` | 思考 | opinions, career and indie-product reflections, observations and jokes about the trade |
| `life` | 生活 | daily life, travel, shopping, food, family and personal devices |

Pick the one the post is mainly about; a post about his own product is `make` even when it is about AI. When unsure, find the two or three closest earlier notes in `categories.json` and follow them. A self-reply continuation takes the category of the note it continues (the build fails otherwise), and a reply that has just crossed 10 likes needs a category like any new note. Write the file only through a JSON parser, keeping keys sorted and one space of indent, the way `write_map` in `scripts/notes.py` writes it; `mirrored.json` and `videos.json` use the same one-space indent.

### 9. Build and check

```bash
python3 -I scripts/notes.py build
python3 -I scripts/notes.py build --check
bundle exec jekyll build -q
```

Then check, and stop without committing if any check fails:

- `--check` prints `Schema and offline rebuild check passed`.
- The note count in `_data/notes.json` did not go down, except by notes deleted in step 3.
- Every new note id appears in `_site/notes/index.json`, and `_site/notes/<id>.html` exists for each.
- `git diff --stat` shows only the files listed below, and no old note changed other than its metrics or a newly attached thread.

### 10. Commit and push

What a run commits, and nothing else:

- `_data/notes.json`
- `scripts/notes/categories.json`
- `scripts/notes/links.json`
- `scripts/notes/articles.json`
- `scripts/notes/mirrored.json`
- `scripts/notes/videos.json`

```bash
git add _data/notes.json scripts/notes/categories.json scripts/notes/links.json scripts/notes/articles.json scripts/notes/mirrored.json scripts/notes/videos.json
git commit -m "notes: sync <N> new notes" -m "<since_id> to <newest id>, <P> photos and <V> videos uploaded to R2, checked with build --check and jekyll build."
git pull --rebase origin main
git push origin main
```

- Author: until 2026-11-30, `youxi798 <269735352+youxi798@users.noreply.github.com>` on weekdays and `Tw93 <tw93@qq.com>` on weekends, by Beijing date; from 2026-11-30 always `Tw93 <tw93@qq.com>`. Set it per command with `git -c user.name=… -c user.email=…`, never by editing the config.
- No `Co-authored-by`, no agent signature, no `--no-verify`, never `--force`.
- If the rebase conflicts in any file, abort it, stop and report; do not resolve by taking one side.

### 11. Confirm it is live

Pushing `main` deploys to production through Vercel, usually within three minutes. After the push:

- `https://tw93.fun/notes/<newest id>.html` returns `200` and contains a sentence from that note.
- `https://tw93.fun/notes/index.json` contains the newest id.
- Every newly listed `https://cdn.tw93.fun/notes/<key>.jpg` and `.mp4` returns `200`.

A green push is not a published note: report the run as done only after these pass. If the deploy has not landed after ten minutes, report that, with the commit hash.

### 12. Save the archive

Upload the merged `posts.json` back to `HiTw93-x-export` (when the workspace does not persist), then release the lock.

## Failures

- A network call that fails is retried once. If it fails again, stop the run, report which step and which request failed, and leave the next scheduled run to start again. Do not loop, switch endpoints or retry on a timer.
- An X API rate limit (`429`) ends the run without a commit; the next run picks up the same posts, since `since_id` did not move.
- A partial run commits nothing. Uploaded R2 files that were not listed are harmless: the next run sees them unlisted, uploads them again and lists them.
- Never delete anything from R2, and never edit old notes, `_plugins/notes.rb`, layouts, styles or `scripts/notes.py` as part of a sync. A sync that would need a code change stops and reports what it found.

## Report

Each run ends with one short report: posts fetched, notes added and their ids, photos and videos uploaded, any key or link that failed, the commit hash, and whether the live checks passed. A run with nothing new reports only that.
