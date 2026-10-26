require 'fileutils'
require 'json'

# Markdown surfaces for agents, built from the post sources after the site is
# written:
# - a Markdown twin next to every post, /2026-10-22/desktop.md beside
#   /2026-10-22/desktop.html, headed by its title, date and links;
# - /posts.md and /en/posts.md, every post as a link list with its summary;
# - /api/posts.json, metadata of every post in both languages;
# - /api/posts.jsonl and /api/en/posts.jsonl, one post per line with its full
#   Markdown body, so an agent can search the whole archive in one request.
#
# They are written as plain files in :post_write rather than generated as
# pages: a page ending in .md would go through the Markdown converter and come
# out as HTML, and Liquid would eat the {{ }} that some code samples contain.
# PPT posts (layout: ppt, hidden from the feed) are left out.
module Jekyll
  module MarkdownTwins
    SITE_URL = 'https://tw93.fun'.freeze

    # By :post_write doc.content is rendered HTML, so the Markdown source is
    # kept from :post_read, before Liquid and the converter run.
    SOURCES = {}

    def self.remember(site)
      SOURCES.clear
      %w[posts posts_en].each do |label|
        (site.collections[label]&.docs || []).each { |doc| SOURCES[doc.path] = doc.content.dup }
      end
    end

    def self.visible(site, collection)
      docs = site.collections[collection]&.docs || []
      docs
        .reject { |doc| doc.data['layout'] == 'ppt' || doc.data['hidden'] || doc.data['hide'] }
        .sort_by { |doc| doc.date }
        .reverse
    end

    def self.md_path(doc)
      doc.url.sub(/\.html\z/, '.md')
    end

    # Liquid that the posts use, turned back into plain Markdown.
    def self.body(doc, site)
      asset = site.config['assetUrl'].to_s
      asset = "https:#{asset}" if asset.start_with?('//')
      SOURCES.fetch(doc.path, doc.content)
        .gsub(/\{\{\s*site\.assetUrl\s*\}\}/, asset)
        .gsub(/\{%-?\s*highlight\s+([^\s%]+)[^%]*-?%\}/) { "```#{Regexp.last_match(1).downcase}" }
        .gsub(/\{%-?\s*endhighlight\s*-?%\}/, '```')
        .gsub(/\{%-?\s*(?:raw|endraw)\s*-?%\}/, '')
        .strip
    end

    def self.record(doc, counterpart)
      english = doc.collection.label == 'posts_en'
      {
        'title' => doc.data['title'].to_s,
        'date' => doc.date.strftime('%Y-%m-%d'),
        'language' => english ? 'en-US' : 'zh-CN',
        'summary' => doc.data['summary'].to_s,
        'categories' => Array(doc.data['categories']),
        'url' => SITE_URL + doc.url,
        'markdownUrl' => SITE_URL + md_path(doc),
        'translation' => counterpart && {
          'language' => english ? 'zh-CN' : 'en-US',
          'title' => counterpart.data['title'].to_s,
          'url' => SITE_URL + counterpart.url,
          'markdownUrl' => SITE_URL + md_path(counterpart),
        },
      }
    end

    def self.twin(doc, site, counterpart)
      english = doc.collection.label == 'posts_en'
      meta = record(doc, counterpart)
      lines = ["# #{meta['title']}", '']
      lines += ["> #{meta['summary']}", ''] unless meta['summary'].empty?
      lines << "- #{english ? 'Published' : '发布日期'}: #{meta['date']}"
      lines << "- Author: Tw93"
      lines << "- HTML: #{meta['url']}"
      if counterpart
        lines << "- #{english ? 'Chinese original' : 'English translation'}: #{meta['translation']['markdownUrl']}"
      end
      lines << "- #{english ? 'All posts' : '全部文章'}: #{SITE_URL}#{english ? '/en' : ''}/posts.md"
      lines += ['', '---', '', body(doc, site), '']
      lines.join("\n")
    end

    def self.index(english, docs, pairs)
      lines = [
        english ? '# Tw93 blog posts' : '# Tw93 博客文章',
        '',
        english ? "> #{docs.size} English posts by Tw93, newest first. Append `.md` to a post URL, or follow the markdown link, for the full text." : "> Tw93 的 #{docs.size} 篇中文文章，按时间倒序。每篇的 `.html` 换成 `.md` 就是 Markdown 全文。",
        '',
        "- #{english ? 'Full text of every post, one JSON object per line' : '全部文章全文 JSON Lines'}: #{SITE_URL}/api#{english ? '/en' : ''}/posts.jsonl",
        "- #{english ? 'Metadata of every post' : '全部文章元数据'}: #{SITE_URL}/api/posts.json",
        "- #{english ? 'Chinese posts' : 'English posts'}: #{SITE_URL}#{english ? '' : '/en'}/posts.md",
        '',
      ]
      docs.each do |doc|
        meta = record(doc, pairs[doc])
        lines << "- [#{meta['title']}](#{meta['url']}) - #{meta['date']} - markdown: #{meta['markdownUrl']}"
        lines << "  #{meta['summary']}" unless meta['summary'].empty?
      end
      lines << ''
      lines.join("\n")
    end

    def self.write(site, path, content)
      file = File.join(site.dest, path)
      FileUtils.mkdir_p(File.dirname(file))
      File.write(file, content)
    end

    def self.build(site)
      zh = visible(site, 'posts')
      en = visible(site, 'posts_en')
      by_name = ->(docs) { docs.to_h { |doc| [File.basename(doc.path), doc] } }
      zh_by_name = by_name.call(zh)
      en_by_name = by_name.call(en)
      pairs = {}
      zh.each { |doc| pairs[doc] = en_by_name[File.basename(doc.path)] }
      en.each { |doc| pairs[doc] = zh_by_name[File.basename(doc.path)] }

      (zh + en).each { |doc| write(site, md_path(doc), twin(doc, site, pairs[doc])) }

      write(site, 'posts.md', index(false, zh, pairs))
      write(site, 'en/posts.md', index(true, en, pairs))

      write(site, 'api/posts.json', JSON.pretty_generate(
        'site' => SITE_URL,
        'description' => "Every post on Tw93's blog, Chinese and English, newest first. Full text: /api/posts.jsonl and /api/en/posts.jsonl, or the markdownUrl of a post.",
        'count' => zh.size,
        'englishCount' => en.size,
        'posts' => (zh + en).sort_by { |doc| [-doc.date.to_i, doc.collection.label] }.map { |doc| record(doc, pairs[doc]) },
      ) + "\n")

      { 'api/posts.jsonl' => zh, 'api/en/posts.jsonl' => en }.each do |path, docs|
        lines = docs.map do |doc|
          JSON.generate(record(doc, pairs[doc]).merge('contentMarkdown' => body(doc, site)))
        end
        write(site, path, lines.join("\n") + "\n")
      end
    end
  end
end

Jekyll::Hooks.register :site, :post_read do |site|
  Jekyll::MarkdownTwins.remember(site)
end

Jekyll::Hooks.register :site, :post_write do |site|
  Jekyll::MarkdownTwins.build(site)
end
