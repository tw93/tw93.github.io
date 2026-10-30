require 'cgi'
require 'fileutils'
require 'json'
require 'time'

# /notes/: every original post from @HiTw93 on X, plus the replies worth
# keeping, built from _data/notes.json (written by scripts/notes.py from the
# local X export). Each note is rendered to HTML once here and reused by:
# - /notes/, the newest notes with search, filters and sorting in js/notes.js;
# - /notes/YYYY/MM/, every note of a month as plain HTML for readers without
#   JavaScript and for crawlers;
# - /notes/<id>.html, one page per note, all indexed and in the sitemap;
# - /notes/index.json, /notes/search.json and /notes/html/YYYY-MM.json, what
#   js/notes.js filters, searches, sorts and renders;
# - /notes/feed.xml, /notes.md and /api/notes.jsonl.
# /en/notes/ repeats the list pages and data files with the notes written in
# English and an English interface; the note pages stay at /notes/<id>.html.
module Jekyll
  module Notes
    SITE_URL = 'https://tw93.fun'.freeze
    POEM = '人生到處知何似，應似飛鴻踏雪泥'.freeze
    FIRST_PAGE = 30
    FOLD_CHARS = 360
    # A folded note keeps about as much text as X shows before Show more:
    # 280 in X's count, where a CJK character weighs two.
    PREVIEW_WEIGHT = 280
    AVATAR = 'https://cdn.tw93.fun/notes/avatar.jpg'.freeze
    ZONE = '+08:00'.freeze
    CATEGORIES = {
      'ai' => 'AI', 'tools' => '工具', 'learn' => '学习',
      'make' => '产品', 'think' => '思考', 'life' => '生活',
    }.freeze
    URL_RE = %r{https?://[^\s<>"'，。！？、；：（）《》【】「」]+}.freeze
    TRAIL_RE = /[.,;:!?)\]}'"]+\z/.freeze

    ICONS = {
      'like' => '<path d="M16.5 3C19.54 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"/>',
      'reply' => '<path d="M5.76 18.53 3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11.53a2 2 0 0 1-2 2H5.76z"/>',
      'bookmark' => '<path d="M5 3h14v18l-7-4.67L5 21V3z"/>',
    }.freeze
    TITLES = { 'like' => '点赞', 'reply' => '评论', 'bookmark' => '收藏' }.freeze
    # Interface text for each list: the Chinese one holds every note, the
    # English one only the notes written in English. Keys under 'page' are
    # read by _layouts/notes.html.
    UI = {
      'zh' => {
        'lang' => 'zh', 'root' => '/notes/', 'categories' => CATEGORIES, 'titles' => TITLES,
        'unfold' => '展开全文', 'view' => '在 X 上查看', 'play' => '在 X 上播放', 'quote' => '引用的推文',
        'reply_to' => '回复', 'reply' => '回复', 'archive' => '按月浏览', 'all' => '全部 Notes',
        'page' => {
          'title' => '片语', 'category' => '分类', 'year' => '年份', 'type' => '类型',
          'long' => '长文', 'photo' => '图片', 'video' => '视频', 'thread' => '串', 'replies_only' => '回复',
          'sort' => '排序', 'newest' => '最新', 'oldest' => '最早', 'like' => '点赞最多', 'reply' => '评论最多', 'bookmark' => '收藏最多',
          'search' => '搜索', 'search_label' => '搜索 Notes', 'empty' => '暂时没有相关的 Notes',
          'older' => '更早的 Notes', 'more' => '加载更多', 'retry' => '重新加载', 'archive' => '按月浏览',
        },
      },
      'en' => {
        'lang' => 'en', 'root' => '/en/notes/',
        'categories' => {
          'ai' => 'AI', 'tools' => 'Tools', 'learn' => 'Learning',
          'make' => 'Products', 'think' => 'Thoughts', 'life' => 'Life',
        },
        'titles' => { 'like' => 'Likes', 'reply' => 'Replies', 'bookmark' => 'Bookmarks' },
        'unfold' => 'Show more', 'view' => 'View on X', 'play' => 'Play on X', 'quote' => 'Quoted post',
        'reply_to' => 'Replying to', 'reply' => 'Reply', 'archive' => 'Browse by month', 'all' => 'All notes',
        'page' => {
          'title' => 'Notes', 'category' => 'Topic', 'year' => 'Year', 'type' => 'Type',
          'long' => 'Long', 'photo' => 'Photos', 'video' => 'Videos', 'thread' => 'Threads', 'replies_only' => 'Replies',
          'sort' => 'Sort', 'newest' => 'Latest', 'oldest' => 'Oldest', 'like' => 'Most liked', 'reply' => 'Most replies', 'bookmark' => 'Most bookmarked',
          'search' => 'Search', 'search_label' => 'Search notes', 'empty' => 'No notes found',
          'older' => 'Older notes', 'more' => 'Load more', 'retry' => 'Retry', 'archive' => 'Browse by month',
        },
      },
    }.freeze
    ZH = UI['zh']
    X_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3zm-1.08 16.17h1.7L7.4 4.73H5.58l11.09 14.44z"/></svg>'.freeze
    QUOTE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.58 17.32C3.55 16.23 3 15 3 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38C6.6 8 5.94 10.35 5.68 11.82c.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.76-1.18zm10 0C13.55 16.23 13 15 13 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.76-1.18z"/></svg>'.freeze
    PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'.freeze

    module_function

    # Icons are drawn once per page as symbols and referenced by each note,
    # which keeps them out of the HTML that /notes/data.json repeats per note.
    def sprite
      shapes = ICONS.merge('x' => X_ICON, 'play' => PLAY_ICON, 'quote' => QUOTE_ICON)
      symbols = shapes.map { |name, svg| %(<symbol id="ni-#{name}" viewBox="0 0 24 24">#{svg.sub(/\A<svg[^>]*>/, '').sub(%r{</svg>\z}, '')}</symbol>) }
      %(<svg width="0" height="0" style="position:absolute" aria-hidden="true">#{symbols.join}</svg>)
    end

    def icon(name)
      %(<svg aria-hidden="true"><use href="#ni-#{name}"/></svg>)
    end

    def esc(text)
      CGI.escapeHTML(text.to_s)
    end

    def local(iso)
      Time.parse(iso).getlocal(ZONE)
    end

    def page_url(note)
      "/notes/#{note['id']}.html"
    end

    def count(n, ui = ZH)
      return n >= 1_000 ? "#{(n / 1_000.0).round(1).to_s.sub(/\.0\z/, '')}K" : n.to_s if ui['lang'] == 'en'

      n >= 10_000 ? "#{(n / 10_000.0).round(1).to_s.sub(/\.0\z/, '')}万" : n.to_s
    end

    def month_label(year, month, ui = ZH)
      ui['lang'] == 'en' ? Time.new(year.to_i, month.to_i).strftime('%B %Y') : "#{year.to_i} 年 #{month.to_i} 月"
    end

    def plain(text)
      text.to_s.gsub(URL_RE, '').gsub(/\s+/, ' ').strip
    end

    # Hashtags and @mentions, on a run of text that holds no URL.
    def rich(segment, ui = ZH)
      esc(segment)
        .gsub(/(^|[^\p{L}\p{N}_&])#([\p{L}\p{N}_]+)/) { "#{$1}<a class=\"note-tag\" href=\"#{ui['root']}?q=%23#{CGI.escape($2)}\">##{$2}</a>" }
        .gsub(/(^|[^\p{L}\p{N}_])@(\w{1,15})/) { "#{$1}<a href=\"https://x.com/#{$2}\" rel=\"nofollow noopener\" target=\"_blank\">@#{$2}</a>" }
    end

    def inline(text, ui = ZH)
      out = +''
      pos = 0
      text.to_enum(:scan, URL_RE).each do
        match = Regexp.last_match
        url = match[0]
        trail = url[TRAIL_RE].to_s
        url = url[0...(url.length - trail.length)]
        shown = url.sub(%r{\Ahttps?://(www\.)?}, '')
        shown = "#{shown[0, 40]}…" if shown.length > 42
        out << rich(text[pos...match.begin(0)], ui)
        out << %(<a href="#{esc(url)}" rel="nofollow noopener" target="_blank">#{esc(shown)}</a>#{esc(trail)})
        pos = match.end(0)
      end
      out << rich(text[pos..], ui)
    end

    def text_html(text, ui = ZH)
      return '' if text.to_s.strip.empty?

      text.split(/\n{2,}/).map { |para| "<p>#{inline(para, ui).gsub("\n", '<br>')}</p>" }.join
    end

    # Display size for a thumbnail: a mirrored note image has WebP copies at
    # each of WIDTHS beside it on R2, made by `notes.py resize-media`; X images
    # use their own name= sizes.
    def thumb(src, width)
      if (key = src[MIRRORED, 1])
        "https://cdn.tw93.fun/notes/#{width}/#{key}.webp"
      else
        src.sub('name=large', width > 700 ? 'name=medium' : 'name=small')
      end
    end

    # Width candidates for mirrored images, matching WIDTHS in
    # scripts/notes.py. They are static files rather than Cloudflare
    # /cdn-cgi/image/ resizes: 2920 photos at two widths used up the free
    # plan's 5000 transformations a month, and the rest answered 429
    # (2026-10-28).
    WIDTHS = [680, 1200].freeze
    MIRRORED = %r{\Ahttps://cdn\.tw93\.fun/notes/([A-Za-z0-9_-]+)\.jpg\z}.freeze

    def img_attrs(src, sizes)
      return %(src="#{esc(thumb(src, 1200))}") unless src.match?(MIRRORED)

      set = WIDTHS.map { |w| "#{esc(thumb(src, w))} #{w}w" }.join(', ')
      %(src="#{esc(thumb(src, 680))}" srcset="#{set}" sizes="#{sizes}")
    end

    # One photo or video fills the column up to 640px tall (720px for a
    # video). Two or more sit in a row that scrolls sideways, every item at
    # one height and its own shape, so nothing is cropped.
    def media_html(media, ui = ZH)
      return '' if media.nil? || media.empty?

      single = media.size == 1
      items = media.map do |item|
        w = item['w'].to_i.positive? ? item['w'].to_i : 1200
        h = item['h'].to_i.positive? ? item['h'].to_i : 900
        r = w / h.to_f
        # Shown widths: the strip is 280px tall on phones and 360px above,
        # a single item fills the column (100vw - 30px, at most 740px).
        sizes = single ? "(max-width: 736px) calc(100vw - 30px), #{[740, ((item['type'] == 'photo' ? 640 : 720) * r).round].min}px" : "(max-width: 736px) #{(280 * r).round}px, #{(360 * r).round}px"
        shape = %(width="#{w}" height="#{h}" style="--r: #{w} / #{h}")
        if item['type'] == 'photo'
          src = item['src']
          %(<img class="note-img" #{img_attrs(src, sizes)} data-pswp-src="#{esc(src)}" data-width="#{w}" data-height="#{h}" #{shape} alt="" loading="lazy" decoding="async">)
        elsif item['video']
          # A <video poster> is fetched at once, lazy or not, so the poster is
          # a lazy <img> over a video that loads nothing until it plays.
          poster = %(<img class="note-poster" #{img_attrs(item['poster'].to_s, sizes)} width="#{w}" height="#{h}" alt="" loading="lazy" decoding="async">)
          if item['type'] == 'gif'
            %(<span class="note-player note-gif" style="--r: #{w} / #{h}">#{poster}<video class="note-clip" src="#{esc(item['video'])}" width="#{w}" height="#{h}" muted loop playsinline preload="none"></video></span>)
          else
            length = item['duration'] ? %(<span class="note-duration">#{item['duration'] / 60}:#{format('%02d', item['duration'] % 60)}</span>) : ''
            %(<span class="note-player" style="--r: #{w} / #{h}">#{poster}<video class="note-clip" src="#{esc(item['video'])}" width="#{w}" height="#{h}" controls playsinline preload="none"></video><span class="note-play note-play-center">#{icon('play')}#{length}</span></span>)
          end
        else
          length = item['duration'] ? %(<span class="note-duration">#{item['duration'] / 60}:#{format('%02d', item['duration'] % 60)}</span>) : ''
          %(<a class="note-video" href="#{esc(item['src'])}" target="_blank" rel="noopener" style="--r: #{w} / #{h}" aria-label="#{ui['play']}"><img #{img_attrs(item['poster'].to_s, sizes)} width="#{w}" height="#{h}" alt="" loading="lazy" decoding="async"><span class="note-play">#{icon('play')}#{length}</span></a>)
        end
      end
      %(<div class="note-media#{single ? ' note-media-1' : ' note-strip'}">#{items.join}</div>)
    end

    # An X Article shows as X does: cover, title, then the opening lines.
    def article_html(note)
      card = note['article']
      return '' unless card

      cover = card['cover'] ? %(<img #{img_attrs(card['cover'], '(max-width: 736px) calc(100vw - 30px), 740px')} width="#{card['w']}" height="#{card['h']}" style="--r: #{card['w']} / #{card['h']}" alt="" loading="lazy" decoding="async">) : ''
      preview = card['preview'] ? %(<span class="note-article-text">#{esc(plain(card['preview']))}</span>) : ''
      %(<a class="note-article" href="#{esc(card['url'])}" target="_blank" rel="noopener">#{cover}<span class="note-article-body"><strong>#{esc(card['title'])}</strong>#{preview}</span></a>)
    end

    def quote_html(note, by_id, ui = ZH)
      quote = note['quote']
      return '' unless quote

      own = quote['id'] && by_id[quote['id']]
      if own
        excerpt = plain(own['text'])
        excerpt = "#{excerpt[0, 48]}…" if excerpt.length > 50
        %(<a class="note-quote" href="#{page_url(own)}">#{icon('quote')}#{esc(excerpt.empty? ? ui['quote'] : excerpt)}</a>)
      else
        %(<a class="note-quote" href="#{esc(quote['url'])}" target="_blank" rel="noopener">#{icon('quote')}#{ui['quote']}</a>)
      end
    end

    # Each count opens its own action on X, and the X mark the post itself,
    # one row of links rather than counts with a stray mark at the far end.
    def stats_html(note, ui = ZH)
      metrics = note['metrics'] || {}
      id = note['id']
      targets = {
        'like' => "https://x.com/intent/like?tweet_id=#{id}",
        'reply' => "https://x.com/intent/post?in_reply_to=#{id}",
        'bookmark' => note['url'],
      }
      stats = %w[like reply bookmark].filter_map do |key|
        value = metrics[key].to_i
        next if value.zero?

        %(<a class="note-stat" href="#{esc(targets[key])}" target="_blank" rel="nofollow noopener" title="#{ui['titles'][key]}">#{icon(key)}#{count(value, ui)}</a>)
      end
      stats << %(<a class="note-stat note-x" href="#{esc(note['url'])}" target="_blank" rel="noopener" title="#{ui['view']}" aria-label="#{ui['view']}">#{icon('x')}</a>)
      stats.join
    end

    def weight(char)
      char.match?(/[\p{Han}\p{Hiragana}\p{Katakana}\p{Hangul}\u3000-\u303f\uff00-\uffef]/) ? 2 : 1
    end

    # Where a fold cuts the text: the last sentence, clause or word break
    # within the preview, never inside a link, tag or mention. Nil when the
    # text already fits.
    def fold_cut(text)
      total = 0
      limit = text.each_char.with_index.find { |char, _| (total += weight(char)) > PREVIEW_WEIGHT }&.last
      return nil unless limit && text.length - limit > 20

      [URL_RE, /#[\p{L}\p{N}_]+/, /@\w{1,15}/].each do |re|
        text.to_enum(:scan, re).each do
          match = Regexp.last_match
          limit = match.begin(0) if match.begin(0) < limit && limit < match.end(0)
        end
      end
      floor = limit * 2 / 3
      breaks = [/[。！？!?\n]/, /[，、；：,;:]/, /\s/]
      cut = breaks.lazy.map { |re| text[floor...limit].rindex(re) }.find(&:itself)
      cut = cut ? floor + cut + 1 : limit
      # A line that ends on a colon leads into what was cut, so the fold
      # stops before it.
      head = text[0...cut].rstrip
      if head.end_with?('：', ':') && (start = head.rindex(/[。！？!?\n]/))
        cut = start + 1
      end
      cut.positive? ? cut : nil
    end

    # The fold keeps the opening text and every photo of the first post: the
    # rest of its text and the thread wait behind 展开全文, which sits where
    # the text stops. The link opens the note's own page; js/notes.js
    # unfolds it in place instead.
    def folded_text_html(note, ui = ZH)
      text = note['text'].to_s
      link = %(<a class="note-unfold" href="#{page_url(note)}">#{ui['unfold']}</a>)
      cut = fold_cut(text)
      unless cut
        return %(<p class="note-fold-mark">#{link}</p>) if text.strip.empty?

        return text_html(text, ui).sub(%r{</p>\z}, %(<span class="note-fold-mark"> #{link}</span></p>))
      end

      head = text[0...cut].rstrip
      tail = text[cut..].lstrip
      gap = text[head.length...(text.length - tail.length)]
      paras = head.split(/\n{2,}/)
      last = paras.pop
      # The whitespace at the cut decides whether the hidden text goes on
      # the same line, after a line break, or starts a new paragraph.
      if gap.count("\n") >= 2
        lead = ''
        rest = tail
      else
        lead, rest = tail.split(/\n{2,}/, 2)
        lead = (gap.include?("\n") ? "\n" : gap.empty? ? '' : ' ') + lead.to_s
      end
      # A finished sentence needs no ellipsis; a clause gives its comma to one.
      last = last.to_s
      cut_mark = if last.match?(/[。！？!?]\z/) then ' '
                 else
                   comma = last[/[，、；,;]\z/]
                   if comma
                     last = last.chomp(comma)
                     lead = comma + lead
                   end
                   '…'
                 end
      html = paras.map { |para| "<p>#{inline(para, ui).gsub("\n", '<br>')}</p>" }.join
      html << "<p>#{inline(last, ui).gsub("\n", '<br>')}<span class=\"note-fold-mark\">#{cut_mark}#{link}</span>"
      html << %(<span class="note-tail">#{inline(lead, ui).gsub("\n", '<br>')}</span>) unless lead.empty?
      html << '</p>'
      html << %(<div class="note-rest">#{text_html(rest, ui)}</div>) unless rest.to_s.strip.empty?
      html
    end

    # In lists a long note is folded; see folded_text_html.
    def article(note, by_id, fold: false, ui: ZH)
      folded = fold && !note['article'] && full_text(note).length > FOLD_CHARS
      time = local(note['date'])
      category = ui['categories'].fetch(note['category'])
      meta = [%(<span class="note-name">Tw93</span>), %(<a class="note-date" href="#{page_url(note)}"><time datetime="#{time.iso8601}">#{time.strftime('%Y-%m-%d')}</time></a>)]
      if (reply = note['reply_to'])
        label = reply['user'] ? "#{ui['reply_to']} @#{esc(reply['user'])}" : ui['reply']
        meta << %(<a href="#{esc(reply['url'])}" target="_blank" rel="nofollow noopener">#{label}</a>)
      end
      meta << %(<a class="note-cat" href="#{ui['root']}?c=#{note['category']}">#{category}</a>)

      body = (folded ? folded_text_html(note, ui) : text_html(note['text'], ui)) + article_html(note) + media_html(note['media'], ui)
      thread = (note['thread'] || []).map { |part| text_html(part['text'], ui) + media_html(part['media'], ui) + quote_html(part, by_id, ui) }.join
      body << (folded && !thread.empty? ? %(<div class="note-rest">#{thread}</div>) : thread)
      body << quote_html(note, by_id, ui)

      <<~HTML.delete("\n")
        <article class="note#{folded ? ' note-fold' : ''}" id="n#{note['id']}">
        <div class="note-meta"><img class="note-avatar" src="#{AVATAR}" width="20" height="20" alt="">#{meta.join('<span class="note-dot"> · </span>')}</div>
        <div class="note-body">#{body}</div>
        <div class="note-foot">#{stats_html(note, ui)}</div>
        </article>
      HTML
    end

    # The first image of a list page is usually what paints largest, so it
    # loads at once instead of waiting for layout to find it in view.
    def eager(html)
      html.sub(' loading="lazy"', ' fetchpriority="high"')
    end

    def flags(note)
      media = note['media'] || []
      parts = (note['thread'] || []).flat_map { |part| part['media'] || [] } + media
      flag = +''
      flag << 'l' if note['long']
      flag << 'p' if parts.any? { |m| m['type'] == 'photo' }
      flag << 'v' if parts.any? { |m| m['type'] != 'photo' }
      flag << 't' if note['thread']&.any?
      flag << 'r' if note['kind'] == 'reply'
      flag
    end

    def full_text(note)
      article = note['article'] ? [note['article']['title'], note['article']['preview']] : []
      (article + [note['text']] + (note['thread'] || []).map { |part| part['text'] }).compact.reject(&:empty?).join("\n\n")
    end

    def title_of(note)
      return note['article']['title'] if note['article']

      line = plain(note['text'].to_s.lines.first)
      line = "#{line[0, 30]}…" if line.length > 32
      line.empty? ? "Notes #{local(note['date']).strftime('%Y-%m-%d')}" : line
    end

    def summary_of(note)
      text = plain(full_text(note))
      text.length > 150 ? "#{text[0, 148]}…" : text
    end

    # One row a year and a fixed column a month, December first, so the
    # months line up down the years instead of running on like a sentence.
    def archive_html(months, ui = ZH)
      years = months.keys.group_by { |key| key[0, 4] }
      rows = years.sort.reverse.map do |year, keys|
        links = keys.sort.reverse.map do |key|
          month = key[5, 2].to_i
          size = months[key].size
          title = ui['lang'] == 'en' ? "#{month_label(year, month, ui)}, #{size} note#{size == 1 ? '' : 's'}" : "#{month_label(year, month)}，#{size} 条"
          %(<a href="#{ui['root']}#{key[0, 4]}/#{key[5, 2]}/" style="grid-column: #{14 - month}" title="#{title}">#{month}</a>)
        end
        %(<div class="notes-year"><span>#{year}</span>#{links.join}</div>)
      end
      %(<h2 class="notes-archive-title">#{ui['archive']}</h2>#{rows.join})
    end

    def make_page(site, dir, name, data)
      page = PageWithoutAFile.new(site, site.source, dir, name)
      page.content = ''
      page.data.merge!('poem' => POEM, 'hideHomeActive' => true, 'comments' => false, 'notes_sprite' => sprite)
      page.data.merge!(data)
      page
    end

    class Generator < Jekyll::Generator
      safe true

      def generate(site)
        notes = site.data['notes']
        return unless notes.is_a?(Array) && !notes.empty?

        notes = notes.sort_by { |note| note['date'] }.reverse
        by_id = notes.to_h { |note| [note['id'], note] }
        missing = notes.reject { |note| CATEGORIES.key?(note['category']) }
        raise "notes: #{missing.size} note(s) without a known category, first #{missing.first['id']}" unless missing.empty?

        english = notes.select { |note| note['lang'] == 'en' }
        lists = {
          'zh' => { 'notes' => notes, 'dir' => 'notes' },
          'en' => { 'notes' => english, 'dir' => 'en/notes' },
        }
        lists.each do |lang, list|
          ui = UI[lang]
          list['html'] = list['notes'].to_h { |note| [note['id'], Notes.article(note, by_id, fold: true, ui: ui)] }
          list['months'] = list['notes'].group_by { |note| Notes.local(note['date']).strftime('%Y-%m') }
        end

        lists.each do |lang, list|
          next if list['notes'].empty?

          ui = UI[lang]
          group = list['notes']
          html = list['html']
          months = list['months']
          archive = Notes.archive_html(months, ui)
          since = months.keys.min[0, 4]
          common = { 'notes_ui' => ui['page'].merge('root' => ui['root']), 'notes_archive' => archive }
          common['lang'] = 'en-US' if lang == 'en'

          site.pages << Notes.make_page(site, list['dir'], 'index.html', common.merge(
            'layout' => 'notes', 'title' => 'Notes', 'notes_index' => true,
            'lang_equivalent' => lang == 'en' ? UI['zh']['root'] : UI['en']['root'],
            'summary' => lang == 'en' ? "#{group.size} short posts Tw93 wrote in English on X since #{since}, searchable, filterable by category and sortable by likes." : "Tw93 在 X 上写下的 #{group.size} 条日常思考和碎碎念，从 #{since} 年至今，可以搜索、按分类查找和按点赞排序。",
            'notes_years' => months.keys.map { |key| key[0, 4] }.uniq.sort.reverse,
            'notes_categories' => ui['categories'].filter_map { |key, label| { 'key' => key, 'label' => label } if group.any? { |note| note['category'] == key } },
            'notes_html' => Notes.eager(group.first(FIRST_PAGE).map { |note| html[note['id']] }.join),
            'notes_older' => group.size > FIRST_PAGE ? "#{ui['root']}#{Notes.local(group[FIRST_PAGE]['date']).strftime('%Y/%m')}/" : nil))

          keys = months.keys.sort
          keys.each_with_index do |key, index|
            year, month = key.split('-')
            newer = keys[index + 1]
            older = index.positive? ? keys[index - 1] : nil
            label = Notes.month_label(year, month, ui)
            size = months[key].size
            site.pages << Notes.make_page(site, "#{list['dir']}/#{year}/#{month}", 'index.html', common.merge(
              'layout' => 'notes', 'title' => "#{label} Notes",
              'summary' => lang == 'en' ? "#{size} note#{size == 1 ? '' : 's'} Tw93 wrote in English on X in #{label}." : "Tw93 #{label}在 X 上写下的 #{size} 条 Notes。",
              'notes_month' => label,
              'notes_html' => Notes.eager(months[key].map { |note| html[note['id']] }.join),
              'notes_newer' => newer && { 'url' => "#{ui['root']}#{newer.tr('-', '/')}/", 'label' => Notes.month_label(newer[0, 4], newer[5, 2], ui) },
              'notes_older' => older && { 'url' => "#{ui['root']}#{older.tr('-', '/')}/", 'label' => Notes.month_label(older[0, 4], older[5, 2], ui) }))
          end
        end

        # A note written in English keeps its one page at /notes/<id>.html, in
        # English and leading back to the English lists.
        notes.each do |note|
          time = Notes.local(note['date'])
          ui = note['lang'] == 'en' ? UI['en'] : ZH
          data = {
            # Without an explicit permalink Jekyll drops the .html from page.url,
            # and canonical and sitemap.xml then point at a URL that 404s.
            'permalink' => Notes.page_url(note),
            'layout' => 'note', 'title' => Notes.title_of(note), 'summary' => Notes.summary_of(note),
            'note_html' => Notes.eager(Notes.article(note, by_id, ui: ui)),
            'note_all' => { 'url' => ui['root'], 'label' => ui['all'] },
            'note_month' => { 'url' => "#{ui['root']}#{time.strftime('%Y/%m')}/", 'label' => Notes.month_label(time.year, time.month, ui) },
            'note_jsonld' => JSON.generate(
              '@context' => 'https://schema.org',
              '@type' => 'SocialMediaPosting',
              '@id' => "#{SITE_URL}#{Notes.page_url(note)}",
              'url' => "#{SITE_URL}#{Notes.page_url(note)}",
              'sameAs' => note['url'],
              'headline' => Notes.title_of(note),
              'articleBody' => Notes.full_text(note),
              'datePublished' => time.iso8601,
              'inLanguage' => note['lang'] == 'und' ? 'zh' : note['lang'],
              'author' => { '@type' => 'Person', '@id' => "#{SITE_URL}/#person", 'name' => 'Tw93', 'url' => SITE_URL },
              'interactionStatistic' => [
                { '@type' => 'InteractionCounter', 'interactionType' => 'https://schema.org/LikeAction', 'userInteractionCount' => note.dig('metrics', 'like').to_i },
                { '@type' => 'InteractionCounter', 'interactionType' => 'https://schema.org/CommentAction', 'userInteractionCount' => note.dig('metrics', 'reply').to_i },
              ]
            ).gsub('</', '<\/'),
          }
          data['lang'] = 'en-US' if note['lang'] == 'en'
          site.pages << Notes.make_page(site, 'notes', "#{note['id']}.html", data)
        end

        site.config['notes_build'] = { 'notes' => notes, 'months' => lists['zh']['months'], 'lists' => lists.values }
      end
    end

    def write(site, path, content)
      file = File.join(site.dest, path)
      FileUtils.mkdir_p(File.dirname(file))
      File.write(file, content)
    end

    def record(note)
      {
        'id' => note['id'],
        'url' => "#{SITE_URL}#{page_url(note)}",
        'xUrl' => note['url'],
        'date' => local(note['date']).iso8601,
        'kind' => note['kind'],
        'category' => note['category'],
        'tags' => note['tags'] || [],
        'text' => full_text(note),
        'links' => (note['links'] || []) + (note['thread'] || []).flat_map { |part| part['links'] || [] },
        'likes' => note.dig('metrics', 'like').to_i,
        'replies' => note.dig('metrics', 'reply').to_i,
        'bookmarks' => note.dig('metrics', 'bookmark').to_i,
      }
    end

    def feed(notes)
      updated = local(notes.first['date']).iso8601
      entries = notes.first(50).map do |note|
        time = local(note['date']).iso8601
        <<~XML
          <entry>
            <title>#{esc(title_of(note))}</title>
            <link href="#{SITE_URL}#{page_url(note)}"/>
            <id>#{SITE_URL}#{page_url(note)}</id>
            <published>#{time}</published>
            <updated>#{time}</updated>
            <content type="html">#{esc(text_html(full_text(note)))}</content>
          </entry>
        XML
      end
      <<~XML
        <?xml version="1.0" encoding="utf-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Tw93 Notes</title>
          <link href="#{SITE_URL}/notes/"/>
          <link rel="self" href="#{SITE_URL}/notes/feed.xml"/>
          <id>#{SITE_URL}/notes/</id>
          <updated>#{updated}</updated>
          <author><name>Tw93</name><uri>#{SITE_URL}</uri></author>
        #{entries.join}</feed>
      XML
    end

    def markdown(notes, months)
      lines = [
        '# Tw93 Notes',
        '',
        "> #{notes.size} short posts by Tw93 from X (@HiTw93), originals plus well-received replies, #{months.keys.min} to #{months.keys.max}. Mostly Chinese. Each note has its own page at https://tw93.fun/notes/{id}.html.",
        '',
        "- Every note with full text, one JSON object per line: #{SITE_URL}/api/notes.jsonl",
        "- Browse and search: #{SITE_URL}/notes/",
        "- Atom feed: #{SITE_URL}/notes/feed.xml",
        '',
        '## Months',
        '',
      ]
      months.keys.sort.reverse.each { |key| lines << "- #{key}: #{SITE_URL}/notes/#{key.tr('-', '/')}/ (#{months[key].size})" }
      lines += ['', '## Latest', '']
      notes.first(100).each do |note|
        text = plain(full_text(note))
        text = "#{text[0, 140]}…" if text.length > 140
        lines << "- #{local(note['date']).strftime('%Y-%m-%d')} [#{note['category']}] #{text} #{SITE_URL}#{page_url(note)}"
      end
      lines << ''
      lines.join("\n")
    end

    def build(site)
      state = site.config['notes_build']
      return unless state

      notes = state['notes']
      # Filters and sorting read a small index, about 50KB gzipped, that the
      # page fetches while idle; the text a search needs is a separate file in
      # the same order, fetched once the search field is touched. The HTML of
      # the notes they show comes per month, so a category's first screen
      # loads a few months, not whole years. Each list has its own set.
      state['lists'].each do |list|
        group = list['notes']
        next if group.empty?

        items = group.map do |note|
          {
            'i' => note['id'], 't' => Time.parse(note['date']).to_i, 'c' => note['category'], 'f' => flags(note),
            'l' => note.dig('metrics', 'like').to_i, 'r' => note.dig('metrics', 'reply').to_i,
            'b' => note.dig('metrics', 'bookmark').to_i,
          }
        end
        text = group.map do |note|
          [full_text(note), note.dig('reply_to', 'user') && "@#{note['reply_to']['user']}"].compact.join(' ').gsub(/\s+/, ' ')
        end
        write(site, "#{list['dir']}/index.json", JSON.generate(items))
        write(site, "#{list['dir']}/search.json", JSON.generate(text))
        list['months'].each do |month, notes_of_month|
          write(site, "#{list['dir']}/html/#{month}.json", JSON.generate(notes_of_month.to_h { |note| [note['id'], list['html'][note['id']]] }))
        end
      end
      write(site, 'notes/feed.xml', feed(notes))
      write(site, 'notes.md', markdown(notes, state['months']))
      write(site, 'api/notes.jsonl', notes.map { |note| JSON.generate(record(note)) }.join("\n") + "\n")
    end
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  Jekyll::Notes.build(site)
end
