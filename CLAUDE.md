# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Tw93's personal Jekyll blog (tw93.fun), featuring a custom theme called "cosy-jekyll-theme". It's a minimalist, responsive blog focused on front-end technology, engineering insights, and personal reflections.

## Key Features

- **Bilingual Support**: Main posts in Chinese (`_posts/`) with English translations (`_posts_en/`)
- **Presentation Mode**: Special PPT layout for slide presentations using reveal.js
- **Image Optimization**: Custom CDN filter for Alibaba/Fliggy CDN images with automatic WebP conversion
- **Comments**: Giscus integration for GitHub-based commenting
- **Performance**: No jQuery, lazy loading, compressed assets, and selective resource loading
- **Mobile-First**: Responsive design with special mobile optimizations

## Project Structure

```tree
/
├── _config.yml              # Main Jekyll configuration
├── _posts/                  # Chinese blog posts
├── _posts_en/              # English blog posts
├── _layouts/               # Template layouts
│   ├── home.html          # Homepage layout
│   ├── post.html          # Blog post layout
│   ├── page.html          # Static page layout
│   └── ppt.html           # Presentation layout (reveal.js)
├── _includes/              # Reusable components
│   ├── header.html        # Site header
│   ├── footer.html        # Site footer
│   ├── giscus.html        # Comment system
│   ├── buy-me-coffee.html # Donation component
│   └── ppt-*.html         # PPT-specific includes
├── _sass/                  # SCSS stylesheets
├── _plugins/               # Custom Jekyll plugins
│   └── cdn_image_filter.rb # CDN image optimization
├── images/                 # Static images and assets
├── css/                    # Compiled CSS
├── js/                     # JavaScript files
└── .github/workflows/      # GitHub Actions for deployment
```

## Development Setup

### Prerequisites

- Ruby (version 3.1+)
- Bundler gem
- Node.js (for script tasks)

### Local Development

```bash
# Install dependencies
gem install bundler
bundle install

# Start development server
npm run dev
# or
bundle exec jekyll serve --watch --trace

# Build for production
npm run build
# or
bundle exec jekyll build
```

The site will be available at `http://localhost:4000`

## Configuration

### Site Settings (\_config.yml)

- **Title**: "Tw93"
- **URL**: <https://tw93.fun>
- **Language**: zh-CN (Chinese primary)
- **Timezone**: Africa/El_Aaiun (UTC offset for date handling)
- **Pagination**: 10 posts per page
- **Permalink**: `/:year-:month-:day/:title.html`

### Collections

- `posts`: Main Chinese blog posts
- `posts_en`: English translations with `/en/` prefix

### Plugins

- `jekyll-paginate`: Homepage pagination
- `jekyll-pdf-embed`: PDF embedding capability
- `jekyll-sitemap`: SEO sitemap generation
- `jekyll-feed`: RSS feed generation

## Content Management

### Writing Blog Posts

#### Chinese Posts (`_posts/`)

```yaml
---
layout: post
title: "Post Title"
date: 2025-01-01 16:00:00
summary: "Brief description"
categories: Share # or Life, Tech, etc.
---
Content here...
```

#### English Posts (`_posts_en/`)

```yaml
---
layout: post
title: "English Title"
date: 2025-01-01 16:00:00
summary: "English description"
categories: Life
lang: en-US
---
Content here...
```

#### Presentation Posts (PPT)

```yaml
---
layout: ppt
title: "Presentation Title"
date: 1993-07-01 16:00:00 # Use past dates to hide from main listing
summary: "Presentation description"
comments: false
hidden: true
---
# Slide 1
Content
---
# Slide 2
More content
```

### Special Features

#### Image Optimization

Images from Alibaba/Fliggy CDN are automatically optimized:

- Automatic WebP conversion
- Resize to max 3600px width
- GIF and SVG images are excluded from optimization

#### Comments

- Uses Giscus (GitHub Discussions)
- Automatically disabled for presentations (`comments: false`)
- Supports both Chinese and English languages

#### Donations

- WeChat Pay integration
- Configurable via `showBuyCoffee: true` in \_config.yml

## Deployment

### GitHub Pages (Current)

- Automated via GitHub Actions (`.github/workflows/jekyll.yml`)
- Triggers on pushes to `master` branch
- Ruby 3.1 environment
- Builds and deploys to GitHub Pages

### Manual Deployment

```bash
# Build site
bundle exec jekyll build

# Output will be in _site/ directory
# Deploy _site/ contents to your hosting provider
```

## Customization

### Theme Customization

- SCSS files in `_sass/` directory
- Main stylesheet: `css/index.scss`
- Variables: `_sass/_variables.scss`

### JavaScript Features

- Canvas-based header animation
- Image zoom functionality (Lightense)
- Lazy loading support
- Mobile-optimized interactions

### Custom Plugins

- **CDN Image Filter**: Automatically optimizes CDN images
- Located in `_plugins/cdn_image_filter.rb`
- Usage: `{{ content | cdn_image_filter }}`

## Performance Optimizations

1. **No jQuery**: Vanilla JavaScript for better performance
2. **Lazy Loading**: Images load on demand
3. **Asset Compression**: CSS/JS minification
4. **CDN Integration**: Optimized image delivery
5. **Selective Loading**: Platform-specific resource loading

## SEO and Analytics

- Google Analytics: `G-KS7EDB6BRM`
- Automatic sitemap generation
- RSS feed at `/feed.xml`
- Social media meta tags
- Proper heading hierarchy

## Content Guidelines

### Categories

- **Share**: Technical insights and experiences
- **Life**: Personal reflections and lifestyle
- **Tech**: Pure technical content

### Writing Style

- Focus on practical insights
- Include code examples where relevant
- Use clear, concise language
- Add visual elements (images, diagrams)

### Image Guidelines

- Use CDN URLs when possible for automatic optimization
- Include alt text for accessibility
- Optimize for both desktop and mobile viewing

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Ruby version and gem dependencies
2. **Image Loading**: Verify CDN URLs and optimization filter
3. **Comments Not Loading**: Check Giscus configuration and repo settings
4. **PPT Not Rendering**: Ensure reveal.js assets are properly loaded

### Development Tips

- Use `--trace` flag for detailed error information
- Check browser console for JavaScript errors
- Validate HTML and CSS output
- Test responsive design on multiple devices

## Resources

- **Live Site**: <https://tw93.fun>
- **Theme**: cosy-jekyll-theme
- **Repository**: <https://github.com/tw93/tw93.github.io>
- **Jekyll Docs**: <https://jekyllrb.com/docs/>
- **Reveal.js**: <https://revealjs.com/> (for presentations)

## License

MIT License - Feel free to fork and modify while keeping attribution to the original author.
