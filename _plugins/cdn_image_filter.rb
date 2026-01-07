module Jekyll
  module CDNImageFilter
    # List of domains that support OSS processing
    CDN_DOMAINS = [
      'cdn.fliggy.com',
      'gw.alipayobjects.com',
      'gw.alicdn.com',
      'img.alicdn.com'
    ]

    # Helper to append OSS params to a URL
    def self.append_oss_params(url)
      return url if url.nil? || url.empty?

      # Skip if already processed or is an SVG/GIF
      return url if url.include?('x-oss-process')
      return url if url =~ /\.(svg|gif)$/i

      # Check if domain matches
      domain_match = CDN_DOMAINS.any? { |domain| url.include?(domain) }
      return url unless domain_match

      separator = url.include?('?') ? '&' : '?'
      # Using w_2000 to match weekly project implementation for high-res screens
      "#{url}#{separator}x-oss-process=image/auto-orient,1/resize,w_2000/format,webp"
    end

    # Filter for processing HTML content (<img> tags)
    def cdn_image_filter(input)
      input.gsub(/<img\s+[^>]*src="([^"]+)"[^>]*>/) do |img_tag|
        src = $1
        new_src = CDNImageFilter.append_oss_params(src)

        if src != new_src
          img_tag.sub(src, new_src)
        else
          img_tag
        end
      end
    end

    # Filter for processing raw URLs (e.g. page.feature)
    def cdn_image_url(input)
      CDNImageFilter.append_oss_params(input)
    end
  end
end

Liquid::Template.register_filter(Jekyll::CDNImageFilter)
