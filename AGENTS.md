# tw93.github.io Agent Guide

## Project

This repository powers the personal Jekyll blog at `tw93.fun`.

Deploy surface: pushing `main` is production. Vercel builds the Jekyll site and publishes `tw93.fun` automatically on every push; there is no staging. `.github/workflows/jekyll.yml` is a leftover GitHub Pages workflow that triggers on `master` and never runs; do not treat it as the deploy path.

## Repository Map

- `_posts/` - Chinese posts.
- `_posts_en/` - English posts.
- `_layouts/` - Jekyll layouts, including post and PPT modes.
- `_includes/` - shared page fragments.
- `_sass/` - stylesheets.
- `_plugins/` - custom Jekyll plugins, including CDN image handling.
- `vercel.json` - Vercel build environment, response headers, and the agent rewrites for the production deploy.
- `.github/workflows/sync-ai-data.yml` - 02:00 UTC cron that overwrites `llms-full.txt`, `api/*.json`, and `projects/*.md` from Yobi. The Yobi repo also dispatches it right after a data push, so a clobber can land at any hour; do not hand-edit those files, edits get clobbered on the next run. It only writes those exact filenames and never deletes, so hand-maintained files that live alongside them (`api/llms.txt`, `projects/llms.txt`) are safe.

## Agent Surfaces

These files exist so AI agents and crawlers can use the site without scraping HTML. All of them are hand-maintained and repeat facts that also live in `llms.txt`; when a project, price, or licence changes, update every one of them in the same commit.

- `llms.txt` - orientation file, the entry point. `llms-full.txt` is machine-generated, do not edit.
- `index.md` and `pricing.md` - static markdown at the repo root, no front matter so Jekyll copies them verbatim. Do not add front matter or they turn into HTML pages and the URLs break.
- `openapi.json` - OpenAPI 3.1 description of the read-only endpoints. Verify with `npx @redocly/cli lint openapi.json` after editing.
- `.well-known/` - `ai-plugin.json`, `agent.json`, and `api-catalog` (RFC 9727, extensionless). Listed in `_config.yml` `include:` because Jekyll skips dot-directories.
- `api/llms.txt`, `projects/llms.txt` - scoped context for those two directories.
- `schema-map.xml` - structured data feed list, referenced from `robots.txt` via `Schemamap:`.
- `sitemap-ai.xml` - sitemap for every surface above; new project briefs land here automatically, new root-level files need an explicit entry.
- `_includes/head.html` - the homepage JSON-LD `@graph` (Person, Organization, SoftwareApplication per project). Prices here must match `pricing.md`.
- `vercel.json` - 302s `GET /?mode=agent` and `GET /` with `Accept: text/markdown` to `/index.md`, and sets the `Link` and `Vary` response headers on `/`. These must stay `redirects`, not `rewrites`: Vercel checks the filesystem before applying rewrites, `/` already matches `index.html`, so a rewrite on `/` never fires. Verify after deploying, not just locally. `vercel.json` takes no comment keys, the published schema rejects unknown top-level properties.

Facts in these files must be verifiable. Check licences against the GitHub API and install commands against `api/projects.json` or the project's own README rather than guessing. Do not publish a manifest for a service that does not exist; there is no MCP server, no A2A endpoint, and no write API on this domain.

## Commands

```bash
npm run prep
npm run dev
npm run build
```

`npm run prep` installs Ruby dependencies through Bundler. `npm run build` runs `bundle exec jekyll build`.

## Layout

The reading column is driven by named tokens in `_sass/_variables.scss`. Use them; do not introduce fresh magic numbers for widths.

- Breakpoints: `$medium` 46em (736px) is the phone to tablet switch, deliberately below 48em so iPad mini portrait (744px) and split-view widths get the tablet layout. `$large` 62.5em (1000px) is the desktop switch.
- Column: `$page-width` 900px on desktop, `$page-width-tablet` 760px between `$medium` and `$large`, with `$page-gutter` 20px of minimum breathing room. The pattern for a card is `width: calc(100% - #{$page-gutter * 2}); max-width: $page-width-tablet; margin: auto`.
- The post body, comments, read-more, index list and header container all track the same column, so their left edges line up. Change one and change the rest.
- The article table of contents appears from 84em (1344px). `$toc-rail` is reserved on `#main` and `.header-menu` so the column and the rail centre as a pair; centring the column alone pushes the rail off-screen.

## Content Rules

- Chinese posts live in `_posts/`, English posts in `_posts_en/`, both named `YYYY-MM-DD-{topic}.md` (no `.en` suffix; the directory is the language marker). Do not mix languages in a single post file.
- Posts are zh/en mirror pairs keyed by identical filenames. When editing a post in `_posts/`, check whether `_posts_en/` has the same file and apply the equivalent change there (and vice versa). A few Chinese posts intentionally have no English mirror; do not create one unless asked.
- Required frontmatter: `layout`, `title`, `date`. Preserve all existing frontmatter fields; do not drop keys.
- Every post should carry `poem`, and mirror pairs share the same one. It is what the header banner renders; without it the banner falls back to the title, which cannot wrap on its SVG textPath. `js/index.js` shrinks an oversized banner down to 20px, below which it still clips.
- Preserve the author's voice: do not rewrite colloquial phrasing to formal style, do not add emoji.

## Working Rules

- Do not delete existing posts unless the task explicitly asks.
- Preserve frontmatter fields and date semantics.
- PPT posts use `layout: ppt`; old dates can intentionally hide slides from the normal feed.
- Keep image paths compatible with the CDN image filter.

## Verification

- Content or layout changes: run `npm run build`.
- Workflow/data sync changes: inspect the matching GitHub Actions workflow and required secrets before proposing publication.
- Local visual checks: run `npm run dev` and inspect the affected page.
- Responsive changes: check both sides of every breakpoint, not just a narrow and a wide viewport. The useful widths are 393, 744, 768, 820, 999, 1024, 1343, 1366, 1408 and 1512, across the home list, a post, `/about.html` and `/404.html`. Assert `document.documentElement.scrollWidth === clientWidth` on each; three separate sideways-scroll bugs lived at 393, 999 and 1408 while the extremes looked fine.
- Frontmatter edits: confirm the page builds and appears in the expected language/feed.
- Documentation-only changes: check links and commands.

## GitHub Operations

- Use `gh` for issue and PR inspection.
- Do not post public comments unless the maintainer explicitly asks.
- Draft public replies in the same language as the thread.
