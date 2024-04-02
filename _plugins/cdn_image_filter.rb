# Optimize the images of CDN using OSS rules, except for GIF and SVG images.
# Usage: {{ content | cdn_image_filter }}
module Jekyll
  module CDNImageFilter
    def cdn_image_filter(input)
      input.gsub(/<img src="(https:\/\/cdn\.fliggy\.com\/.*?|https:\/\/gw\.alipayobjects\.com\/.*?)(\.(jpg|jpeg|png|JPG|JPEG|PNG))"/) do |match|
        src = $1
        extension = $2.downcase # 获取文件扩展名并转换为小写
        # 检查是否为GIF或SVG图片，如果是，则不修改
        if extension == ".gif" || extension == ".svg"
          match
        else
          if src.start_with?('https://cdn.fliggy.com') || src.start_with?('https://gw.alipayobjects.com')
            "#{match.chomp('"')}?x-oss-process=image/resize,w_3600/format,webp\""
          else
            match
          end
        end
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::CDNImageFilter)
