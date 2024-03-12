# Optimize the images of CDN using OSS rules.
# Usage: {{ content | cdn_image_filter }}
module Jekyll
  module CDNImageFilter
    def cdn_image_filter(input)
      input.gsub(/<img src="(https:\/\/cdn\.fliggy\.com\/.*?|https:\/\/gw\.alipayobjects\.com\/.*?)"/) do |match|
        src = $1
        if src.start_with?('https://cdn.fliggy.com') || src.start_with?('https://gw.alipayobjects.com')
          "#{match.chomp('"')}?x-oss-process=image/resize,w_3600/format,webp\""
        else
          match
        end
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::CDNImageFilter)
