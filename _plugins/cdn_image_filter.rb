require 'cgi'
require 'set'

module Jekyll
  module CDNImageFilter
    # Live Aliyun OSS CDNs that support ?x-oss-process= image params.
    OSS_DOMAINS = [
      'gw.alipayobjects.com',
      'gw.alicdn.com',
      'img.alicdn.com'
    ]

    # Cloudflare R2 custom domain. R2 does NOT support ?x-oss-process=; it uses
    # Cloudflare's /cdn-cgi/image/ URL transformations instead (auto webp/avif).
    CF_DOMAIN = 'cdn.tw93.fun'
    CF_PREFIX = "https://#{CF_DOMAIN}/".freeze
    CF_TRANSFORM = 'width=2000,quality=80,format=auto,fit=scale-down'.freeze

    # Build an optimized image URL based on the source host.
    def self.optimize(url)
      return url if url.nil? || url.empty?
      return url if url =~ /\.(svg|gif)$/i

      # cdn.tw93.fun (Cloudflare R2) -> /cdn-cgi/image/ transformation.
      if url.start_with?(CF_PREFIX)
        return url if url.include?('/cdn-cgi/image/')
        rest = url[CF_PREFIX.length..-1]
        return "#{CF_PREFIX}cdn-cgi/image/#{CF_TRANSFORM}/#{rest}"
      end

      # Live Aliyun OSS CDNs -> ?x-oss-process= params.
      return url if url.include?('x-oss-process')
      domain_match = OSS_DOMAINS.any? { |domain| url.include?(domain) }
      return url unless domain_match

      separator = url.include?('?') ? '&' : '?'
      # Using w_2000 to match weekly project implementation for high-res screens
      "#{url}#{separator}x-oss-process=image/auto-orient,1/resize,w_2000/format,webp"
    end

    UNSIZED = Set.new

    # Add width and height from _data/image_sizes.json (written by
    # scripts/image_sizes.py) so the browser reserves the image's box before it
    # loads instead of growing from zero height. CSS keeps max-width: 100% and
    # height: auto, so the rendered size does not change. A tag that already has
    # both is left alone; one with only a width gets the matching height.
    def self.with_size(img_tag, src, sizes)
      return img_tag if sizes.nil? || img_tag =~ /\sheight=/i
      size = sizes[CGI.unescapeHTML(src)]
      unless size
        UNSIZED << src if src.start_with?('http', '/')
        return img_tag
      end
      w, h, fluid = size
      if (m = img_tag.match(/\swidth=["']?(\d+)/i))
        img_tag.sub(/<img\b/i, %(<img height="#{(m[1].to_i * h.to_f / w).round}"))
      elsif fluid
        # An SVG with only a viewBox fills the column; width: 100% keeps that
        # while the attributes still give the browser its aspect ratio.
        return img_tag if img_tag =~ /\sstyle=/i
        img_tag.sub(/<img\b/i, %(<img width="#{w}" height="#{h}" style="width: 100%"))
      else
        img_tag.sub(/<img\b/i, %(<img width="#{w}" height="#{h}"))
      end
    end

    # Filter for processing HTML content (<img> tags)
    def cdn_image_filter(input)
      sizes = @context.registers[:site].data['image_sizes']
      input.gsub(/<img\s+[^>]*src="([^"]+)"[^>]*>/) do |img_tag|
        src = $1
        img_tag = CDNImageFilter.with_size(img_tag, src, sizes)
        new_src = CDNImageFilter.optimize(src)

        if src != new_src
          img_tag.sub(src, new_src)
        else
          img_tag
        end
      end
    end

    # Filter for processing raw URLs (e.g. page.feature)
    def cdn_image_url(input)
      CDNImageFilter.optimize(input)
    end
  end
end

Liquid::Template.register_filter(Jekyll::CDNImageFilter)

# Name the images that render without a reserved box, so a post pushed without
# running scripts/image_sizes.py shows up in the build log, Vercel's included.
Jekyll::Hooks.register :site, :post_render do
  unsized = Jekyll::CDNImageFilter::UNSIZED
  next if unsized.empty?
  Jekyll.logger.warn 'Image sizes:', "#{unsized.size} image(s) have no recorded size; run python3 scripts/image_sizes.py"
  unsized.first(10).each { |src| Jekyll.logger.warn '', src }
  unsized.clear
end
