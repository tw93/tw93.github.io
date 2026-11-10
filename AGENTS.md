# tw93.github.io Agent Guide

## Project

This repository powers the personal Jekyll blog at `tw93.fun`.

Deploy surface: pushing `main` is production. Vercel builds the Jekyll site and publishes `tw93.fun` automatically on every push; there is no staging. `.github/workflows/jekyll.yml` is a leftover GitHub Pages workflow whose `master` push trigger is dormant, but `workflow_dispatch` can still deploy it manually; do not run it or treat it as the production deploy path.

## Repository Map

- `_posts/` - Chinese posts.
- `_posts_en/` - English posts.
- `_layouts/` - Jekyll layouts, including post and PPT modes.
- `_includes/` - shared page fragments.
- `_includes/giscus.html` - the comment widget. Its theme is `https://weekly.tw93.fun/styles/giscus-blog.css`, generated in the Weekly repo with Weekly's two themes from one template; change comment styles there, not here. Each page's discussion is found by its file name (`2026-10-22-desktop`, `about`; a zh/en pair shares one) in strict mode, which matches `<!-- sha1: <sha1 of the name> -->` in the discussion body rather than searching titles: the title search put About on a 2015 post whose title contains "about" and made duplicates when it missed (2026-10-30, when 45 bodies were given their hash). A discussion made by hand or moved to another page needs that line, and only one discussion may carry a given name's hash. Weekly serves `/styles/` with a one-day max-age and a week of stale-while-revalidate, so after a theme change set the `?v=` on that URL to the Weekly commit, or readers keep the old theme for up to a week.
- `_sass/` - stylesheets.
- `_plugins/` - custom Jekyll plugins, including CDN image handling and `markdown_twins.rb`, which writes the post Markdown surfaces listed under Agent Surfaces.
- Fonts: `css/jinkai.css` holds the TsangerJinKai `@font-face` rules; the font files live on `gw.alipayobjects.com`, cached a year, at the same URLs Weekly uses, so the browser shares them between the two sites. The stylesheet is linked without the build version so its one-year `/css/` cache survives deploys; if it ever changes, give it a new file name. Two things were tried and reverted on 2026-10-28, measured cold against the previous build: writing each page's own `@font-face` rules inline (the fonts are bandwidth-bound, so starting them early only took bandwidth from the first image, desktop LCP 264 to 564ms on a post), and serving the stylesheet from `cdn.tw93.fun` for Weekly to share (the extra connection delayed the fonts from 118 to 659ms on desktop, to save a 30KB file once).
- `vercel.json` - Vercel build command and environment, response headers, and the agent redirects for the production deploy. `buildCommand` runs `bundle exec jekyll build` directly: the Vercel image has no Pillow, so routing it through `npm run build` and `scripts/image_sizes.py` failed every deploy from 76d1123 to a73553e (2026-10-26). Image metadata is a local step committed with the post.
- `.github/workflows/sync-ai-data.yml` - 02:00 UTC cron that overwrites `llms-full.txt`, `api/*.json`, and the Yobi-owned `projects/*.md` mirrors. The Yobi repo also dispatches it right after a data push, so a clobber can land at any hour; do not hand-edit those files, edits get clobbered on the next run. It removes stale `projects/*.md` mirrors that no longer exist in Yobi, but exact-scope hand-maintained files alongside them (`api/llms.txt`, `projects/llms.txt`) remain safe. It also rewrites the `NK+ GitHub stars across N projects` line in the otherwise hand-written `llms.txt` and `index.md` from `api/profile.json`, and pings IndexNow for the AI surfaces it changed.

## Notes

The `/notes/` pipeline (X export, media on R2, sync, generated pages) is in `.claude/rules/notes.md`, loaded when you touch `scripts/notes/`, `_plugins/notes.rb`, `js/notes.js` or `_data/notes.json`.

## Agent Surfaces

The AI and crawler surfaces (`llms.txt`, `index.md`, `pricing.md`, `openapi.json`, `.well-known/`, `api/`, `projects/`, sitemaps, the price and project-count grep recipes) are in `.claude/rules/agent-surfaces.md`, loaded when you touch those files. `llms-full.txt` and the Yobi-owned `api/*.json` / `projects/*.md` mirrors are generated: do not hand-edit them.

## Commands

```bash
npm run prep
npm run dev
npm run build
```

`npm run prep` installs Ruby dependencies through Bundler. `npm run build` first runs `python3 scripts/image_sizes.py`, which may fetch missing image metadata and update `_data/image_sizes.json`, then runs `bundle exec jekyll build`.

## Layout

Breakpoints, column width, type ladder and centring rules are in `.claude/rules/layout.md`, loaded when you touch `_sass/`, `css/`, `js/index.js` or `_layouts/`. Use its named tokens in `_sass/_variables.scss`; do not introduce fresh magic numbers for widths.

## Content Rules

- Chinese posts live in `_posts/`, English posts in `_posts_en/`, both named `YYYY-MM-DD-{topic}.md` (no `.en` suffix; the directory is the language marker). Do not mix languages in a single post file.
- Non-post zh/en pairs: `index.html` / `en/index.html`, `about.md` / `en/about.md`, `posts/index.html` / `en/posts/index.html` (the Blog archive in the header), `privacy.md` / `en/privacy.md`, `feed.xml` / `en/feed.xml`. `index.md`, `pricing.md`, and the agent surfaces are English-only by design.
- Posts are zh/en mirror pairs keyed by identical filenames. When editing a post in `_posts/`, check whether `_posts_en/` has the same file and apply the equivalent change there (and vice versa). A few Chinese posts intentionally have no English mirror; do not create one unless asked.
- Required frontmatter: `layout`, `title`, `date`. Preserve all existing frontmatter fields; do not drop keys.
- Every post should carry `poem`, and mirror pairs share the same one. It is what the header banner renders; without it the banner falls back to the title, which cannot wrap on its SVG textPath. `js/index.js` shrinks an oversized banner down to 20px, below which it still clips.
- Pages that are not posts carry a `poem` too, chosen for what the page is and who the author is, never praising the author and never repeating a post's (maintainer 2026-10-30; 腹有詩書氣自華, 致廣大而盡精微 and 君子之交淡若水 were replaced the same day as self-praise): the archive 舊書不厭百回讀，熟讀深思子自知, notes 人生到處知何似，應似飛鴻踏雪泥, about 且將新火試新茶，詩酒趁年華, privacy 往者不追，來者不拒, 404 只在此山中，雲深不知處. They are all two lines, as 72 of the 100 posts' are. A zh/en pair shares one. The home banner keeps its motto instead.
- Preserve the author's voice: do not rewrite colloquial phrasing to formal style, do not add emoji.

## Working Rules

- Do not delete existing posts unless the task explicitly asks.
- Once a new post is live, make sure its comment discussion exists and react to it as tw93 (maintainer 2026-11-04). giscus usually creates it on the first visit; if not, create it in the General category of `tw93/tw93.github.io` titled with the file name (`2026-11-03-senior`) and a body of `# <name>`, the summary, the post URL and `<!-- sha1: <sha1 of the name> -->`, the shape every recent discussion has. Then add the six positive reactions, `THUMBS_UP LAUGH HOORAY HEART ROCKET EYES` (never `THUMBS_DOWN` or `CONFUSED`), with `gh api graphql` `addReaction` on the discussion id, and read back `viewerHasReacted` for all six.
- Preserve frontmatter fields and date semantics.
- PPT posts use `layout: ppt`; old dates can intentionally hide slides from the normal feed.
- Keep image paths compatible with the CDN image filter.

## Verification

- Content or layout changes: run `npm run build`.
- Workflow/data sync changes: inspect the matching GitHub Actions workflow and required secrets before proposing publication.
- Local visual checks: run `npm run dev` and inspect the affected page.
- Responsive changes: check both sides of every breakpoint, not just a narrow and a wide viewport. The useful widths are 393, 744, 768, 820, 999, 1024, 1343, 1366, 1408 and 1512, across the home list, a post, `/about.html` and `/404.html`. Assert `document.documentElement.scrollWidth === clientWidth` on each; three separate sideways-scroll bugs lived at 393, 999 and 1408 while the extremes looked fine.
- Image changes: `python3 scripts/image_sizes.py --check` lists unrecorded post images and exits 1 if any are missing; it does not fetch or write metadata.
- Frontmatter edits: confirm the page builds and appears in the expected language/feed. `python3 scripts/check_seo_copy.py` checks that every post has its own summary in the file's language. It does not enforce a character count. A post's `summary` is its opening paragraph verbatim, links reduced to their text (a linked post title in 《》 or curly quotes); never write a separate digest of the post (maintainer 2026-10-26).

## GitHub Operations

- Use `gh` for issue and PR inspection.
- Do not post public comments unless the maintainer explicitly asks.
- Draft public replies in the same language as the thread.
