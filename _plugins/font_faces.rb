require 'cgi'

# Writes into each page the @font-face rules for the TsangerJinKai subsets its
# own text uses, so the browser starts on those fonts while it parses the HTML
# instead of after a second stylesheet arrives. The full set, for text that
# scripts add later (notes filters, search results), still loads afterwards at
# low priority from a fixed URL that Weekly shares.
#
#   <!-- jinkai-faces -->   in _includes/head.html becomes <style>…</style>
module Jekyll
  module FontFaces
    MARK = '<!-- jinkai-faces -->'.freeze
    SOURCE = 'css/jinkai.css'.freeze

    class << self
      # Each rule minified, and every code point mapped to the rule whose
      # unicode-range holds it (the ranges do not overlap).
      def faces(site)
        @faces ||= begin
          rules = File.read(File.join(site.source, SOURCE)).scan(/@font-face\s*\{.*?\}/m)
          map = {}
          rules.each_with_index do |rule, i|
            rule[/unicode-range:\s*([^;]+);/, 1].split(',').each do |part|
              lo, hi = part.strip.delete_prefix('U+').split('-').map { |hex| hex.to_i(16) }
              (lo..(hi || lo)).each { |cp| map[cp] ||= i }
            end
          end
          [rules.map { |rule| rule.gsub(/\s*([{};:,])\s*/, '\1').sub(';}', '}') }, map]
        end
      end

      def reset
        @faces = nil
      end

      def inject(doc)
        return unless doc.output&.include?(MARK)

        rules, map = faces(doc.site)
        # Entities count as the characters they show: &gt; draws a >.
        text = CGI.unescapeHTML(doc.output.gsub(%r{<(script|style)\b.*?</\1>}m, ' ').gsub(/<[^>]*>/, ' '))
        used = text.unpack('U*').uniq.filter_map { |cp| map[cp] }.uniq.sort
        doc.output = doc.output.sub(MARK, "<style>#{used.map { |i| rules[i] }.join}</style>")
      rescue ArgumentError
        # Text that is not valid UTF-8 keeps only the full stylesheet.
        doc.output = doc.output.sub(MARK, '')
      end
    end
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  Jekyll::FontFaces.inject(doc)
end

Jekyll::Hooks.register :site, :after_reset do
  Jekyll::FontFaces.reset
end
