# Renders a stylesheet's compiled CSS straight into the page, so first paint
# does not wait on a separate stylesheet request. The Sass source is compiled
# once per build and reused by every page.
#
#   <style>{% inline_css css/index.scss %}</style>
module Jekyll
  class InlineCSSTag < Liquid::Tag
    CACHE = {}

    def initialize(tag_name, path, tokens)
      super
      @path = path.strip
    end

    def render(context)
      site = context.registers[:site]
      CACHE[@path] ||= begin
        source = File.read(File.join(site.source, @path))
        # Drop the front matter that makes Jekyll publish the file on its own.
        source = source.sub(/\A---\s*\n.*?\n---\s*\n/m, '')
        converter = site.find_converter_instance(Jekyll::Converters::Scss)
        converter.convert(source).sub(%r{/\*# sourceMappingURL=.*?\*/\s*\z}, '').strip
      end
    end
  end
end

Liquid::Template.register_tag('inline_css', Jekyll::InlineCSSTag)

Jekyll::Hooks.register :site, :after_reset do
  Jekyll::InlineCSSTag::CACHE.clear
end
