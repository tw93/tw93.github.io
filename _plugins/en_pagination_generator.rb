module Jekyll
  class EnglishPaginationPage < Page
    def initialize(site, base, dir, page_number)
      @site = site
      @base = base
      @dir = dir
      @name = "index.html"

      process(@name)
      read_yaml(File.join(base, "en"), "index.html")
      data["en_page_number"] = page_number
    end
  end

  class EnglishPaginationGenerator < Generator
    safe true
    priority :low

    def generate(site)
      per_page = (site.config["paginate"] || 10).to_i
      return if per_page <= 0

      collection = site.collections["posts_en"]
      return unless collection

      visible_posts = collection.docs.reject do |post|
        post.data["hidden"] == true || post.data["hide"] == true
      end

      total_pages = (visible_posts.size.to_f / per_page).ceil
      return if total_pages <= 1

      existing_urls = site.pages.map(&:url)

      (2..total_pages).each do |page_number|
        url = "/en/page#{page_number}/"
        next if existing_urls.include?(url)

        page = EnglishPaginationPage.new(
          site,
          site.source,
          File.join("en", "page#{page_number}"),
          page_number
        )
        site.pages << page
      end
    end
  end
end
