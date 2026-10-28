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
# - /notes/data.json, what js/notes.js loads to search and sort;
# - /notes/feed.xml, /notes.md and /api/notes.jsonl.
module Jekyll
  module Notes
    SITE_URL = 'https://tw93.fun'.freeze
    POEM = '人生到處知何似，應似飛鴻踏雪泥'.freeze
    FIRST_PAGE = 30
    FOLD_CHARS = 360
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

    def count(n)
      n >= 10_000 ? "#{(n / 10_000.0).round(1).to_s.sub(/\.0\z/, '')}万" : n.to_s
    end

    def plain(text)
      text.to_s.gsub(URL_RE, '').gsub(/\s+/, ' ').strip
    end

    # Hashtags and @mentions, on a run of text that holds no URL.
    def rich(segment)
      esc(segment)
        .gsub(/(^|[^\p{L}\p{N}_&])#([\p{L}\p{N}_]+)/) { "#{$1}<a class=\"note-tag\" href=\"/notes/?q=%23#{CGI.escape($2)}\">##{$2}</a>" }
        .gsub(/(^|[^\p{L}\p{N}_])@(\w{1,15})/) { "#{$1}<a href=\"https://x.com/#{$2}\" rel=\"nofollow noopener\" target=\"_blank\">@#{$2}</a>" }
    end

    def inline(text)
      out = +''
      pos = 0
      text.to_enum(:scan, URL_RE).each do
        match = Regexp.last_match
        url = match[0]
        trail = url[TRAIL_RE].to_s
        url = url[0...(url.length - trail.length)]
        shown = url.sub(%r{\Ahttps?://(www\.)?}, '')
        shown = "#{shown[0, 40]}…" if shown.length > 42
        out << rich(text[pos...match.begin(0)])
        out << %(<a href="#{esc(url)}" rel="nofollow noopener" target="_blank">#{esc(shown)}</a>#{esc(trail)})
        pos = match.end(0)
      end
      out << rich(text[pos..])
    end

    def text_html(text)
      return '' if text.to_s.strip.empty?

      text.split(/\n{2,}/).map { |para| "<p>#{inline(para).gsub("\n", '<br>')}</p>" }.join
    end

    # Display size for a thumbnail: R2 images go through Cloudflare's resize,
    # X images through their own name= sizes.
    def thumb(src, width)
      if src.start_with?('https://cdn.tw93.fun/')
        src.sub('https://cdn.tw93.fun/', "https://cdn.tw93.fun/cdn-cgi/image/width=#{width},quality=80,format=auto,fit=scale-down/")
      else
        src.sub('name=large', width > 700 ? 'name=medium' : 'name=small')
      end
    end

    def media_html(media)
      return '' if media.nil? || media.empty?

      single = media.size == 1
      items = media.map do |item|
        w = item['w'].to_i.positive? ? item['w'].to_i : 1200
        h = item['h'].to_i.positive? ? item['h'].to_i : 900
        if item['type'] == 'photo'
          src = item['src']
          %(<img class="note-img" src="#{esc(thumb(src, single ? 1200 : 680))}" data-pswp-src="#{esc(src)}" data-width="#{w}" data-height="#{h}" width="#{w}" height="#{h}" style="--r: #{w} / #{h}" alt="" loading="lazy" decoding="async">)
        else
          length = item['duration'] ? %(<span class="note-duration">#{item['duration'] / 60}:#{format('%02d', item['duration'] % 60)}</span>) : ''
          %(<a class="note-video" href="#{esc(item['src'])}" target="_blank" rel="noopener" style="--r: #{w} / #{h}" aria-label="在 X 上播放"><img src="#{esc(thumb(item['poster'].to_s, single ? 1200 : 680))}" width="#{w}" height="#{h}" alt="" loading="lazy" decoding="async"><span class="note-play">#{icon('play')}#{length}</span></a>)
        end
      end
      %(<div class="note-media note-media-#{[media.size, 4].min}">#{items.join}</div>)
    end

    def quote_html(note, by_id)
      quote = note['quote']
      return '' unless quote

      own = quote['id'] && by_id[quote['id']]
      if own
        excerpt = plain(own['text'])
        excerpt = "#{excerpt[0, 48]}…" if excerpt.length > 50
        %(<a class="note-quote" href="#{page_url(own)}">#{icon('quote')}#{esc(excerpt.empty? ? '引用的推文' : excerpt)}</a>)
      else
        %(<a class="note-quote" href="#{esc(quote['url'])}" target="_blank" rel="noopener">#{icon('quote')}引用的推文</a>)
      end
    end

    def stats_html(note)
      metrics = note['metrics'] || {}
      stats = %w[like reply bookmark].filter_map do |key|
        value = metrics[key].to_i
        next if value.zero?

        %(<span class="note-stat" title="#{TITLES[key]}">#{icon(key)}#{count(value)}</span>)
      end
      stats.join
    end

    def author_html
      %(<div class="notes-author"><img src="#{AVATAR}" width="44" height="44" alt="Tw93"><div><strong>Tw93</strong><a href="https://x.com/HiTw93" target="_blank" rel="noopener">@HiTw93</a></div></div>)
    end

    # In lists a long note is folded to a few lines; the link opens the note's
    # own page, and js/notes.js unfolds it in place instead.
    def article(note, by_id, fold: false)
      folded = fold && full_text(note).length > FOLD_CHARS
      time = local(note['date'])
      category = CATEGORIES.fetch(note['category'])
      meta = [%(<a class="note-date" href="#{page_url(note)}"><time datetime="#{time.iso8601}">#{time.strftime('%Y-%m-%d')}</time></a>)]
      if (reply = note['reply_to'])
        label = reply['user'] ? "回复 @#{esc(reply['user'])}" : '回复'
        meta << %(<a href="#{esc(reply['url'])}" target="_blank" rel="nofollow noopener">#{label}</a>)
      end
      meta << %(<a class="note-cat" href="/notes/?c=#{note['category']}">#{category}</a>)

      body = text_html(note['text']) + media_html(note['media'])
      (note['thread'] || []).each { |part| body << text_html(part['text']) << media_html(part['media']) << quote_html(part, by_id) }
      body << quote_html(note, by_id)

      <<~HTML.delete("\n")
        <article class="note#{folded ? ' note-fold' : ''}" id="n#{note['id']}">
        <div class="note-meta">#{meta.join('<span class="note-dot"> · </span>')}</div>
        <div class="note-body">#{body}</div>
        #{folded ? %(<a class="note-unfold" href="#{page_url(note)}">展开全文</a>) : ''}
        <div class="note-foot">#{stats_html(note)}<a class="note-x" href="#{esc(note['url'])}" target="_blank" rel="noopener" title="在 X 上查看" aria-label="在 X 上查看">#{icon('x')}</a></div>
        </article>
      HTML
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
      ([note['text']] + (note['thread'] || []).map { |part| part['text'] }).compact.reject(&:empty?).join("\n\n")
    end

    def title_of(note)
      line = plain(note['text'].to_s.lines.first)
      line = "#{line[0, 30]}…" if line.length > 32
      line.empty? ? "Notes #{local(note['date']).strftime('%Y-%m-%d')}" : line
    end

    def summary_of(note)
      text = plain(full_text(note))
      text.length > 150 ? "#{text[0, 148]}…" : text
    end

    def archive_html(months)
      years = months.keys.group_by { |key| key[0, 4] }
      rows = years.sort.reverse.map do |year, keys|
        links = keys.sort.reverse.map do |key|
          %(<a href="/notes/#{key[0, 4]}/#{key[5, 2]}/" title="#{months[key].size} 条">#{key[5, 2].to_i} 月</a>)
        end
        %(<div class="notes-year"><span>#{year}</span>#{links.join}</div>)
      end
      rows.join
    end

    def make_page(site, dir, name, data)
      page = PageWithoutAFile.new(site, site.source, dir, name)
      page.content = ''
      page.data.merge!('poem' => POEM, 'hideHomeActive' => true, 'comments' => false, 'notes_sprite' => sprite, 'notes_author' => author_html)
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

        html = notes.to_h { |note| [note['id'], Notes.article(note, by_id, fold: true)] }
        months = notes.group_by { |note| Notes.local(note['date']).strftime('%Y-%m') }
        archive = Notes.archive_html(months)

        site.pages << Notes.make_page(site, 'notes', 'index.html',
          'layout' => 'notes', 'title' => 'Notes', 'notes_index' => true,
          'summary' => "Tw93 在 X 上写下的 #{notes.size} 条日常思考和碎碎念，从 #{months.keys.min[0, 4]} 年至今，可以搜索、按分类查找和按点赞排序。",
          'notes_total' => notes.size,
          'notes_years' => months.keys.map { |key| key[0, 4] }.uniq.sort.reverse,
          'notes_categories' => CATEGORIES.map { |key, label| { 'key' => key, 'label' => label } },
          'notes_html' => notes.first(FIRST_PAGE).map { |note| html[note['id']] }.join,
          'notes_older' => notes.size > FIRST_PAGE ? "/notes/#{Notes.local(notes[FIRST_PAGE]['date']).strftime('%Y/%m')}/" : nil,
          'notes_archive' => archive)

        keys = months.keys.sort
        keys.each_with_index do |key, index|
          year, month = key.split('-')
          newer = keys[index + 1]
          older = index.positive? ? keys[index - 1] : nil
          site.pages << Notes.make_page(site, "notes/#{year}/#{month}", 'index.html',
            'layout' => 'notes', 'title' => "#{year} 年 #{month.to_i} 月 Notes",
            'summary' => "Tw93 #{year} 年 #{month.to_i} 月在 X 上写下的 #{months[key].size} 条 Notes。",
            'notes_month' => "#{year} 年 #{month.to_i} 月",
            'notes_html' => months[key].map { |note| html[note['id']] }.join,
            'notes_newer' => newer && { 'url' => "/notes/#{newer.tr('-', '/')}/", 'label' => "#{newer[0, 4]} 年 #{newer[5, 2].to_i} 月" },
            'notes_older' => older && { 'url' => "/notes/#{older.tr('-', '/')}/", 'label' => "#{older[0, 4]} 年 #{older[5, 2].to_i} 月" },
            'notes_archive' => archive)
        end

        notes.each do |note|
          time = Notes.local(note['date'])
          data = {
            # Without an explicit permalink Jekyll drops the .html from page.url,
            # and canonical and sitemap.xml then point at a URL that 404s.
            'permalink' => Notes.page_url(note),
            'layout' => 'note', 'title' => Notes.title_of(note), 'summary' => Notes.summary_of(note),
            'note_html' => Notes.article(note, by_id),
            'note_month' => { 'url' => "/notes/#{time.strftime('%Y/%m')}/", 'label' => "#{time.year} 年 #{time.month} 月" },
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
          site.pages << Notes.make_page(site, 'notes', "#{note['id']}.html", data)
        end

        site.config['notes_build'] = { 'notes' => notes, 'html' => html, 'months' => months }
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
      items = notes.map do |note|
        {
          'i' => note['id'], 't' => Time.parse(note['date']).to_i, 'c' => note['category'], 'f' => flags(note),
          'l' => note.dig('metrics', 'like').to_i, 'r' => note.dig('metrics', 'reply').to_i,
          'b' => note.dig('metrics', 'bookmark').to_i, 'h' => state['html'][note['id']],
        }
      end
      write(site, 'notes/data.json', JSON.generate(items))
      write(site, 'notes/feed.xml', feed(notes))
      write(site, 'notes.md', markdown(notes, state['months']))
      write(site, 'api/notes.jsonl', notes.map { |note| JSON.generate(record(note)) }.join("\n") + "\n")
    end
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  Jekyll::Notes.build(site)
end
