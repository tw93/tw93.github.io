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
- `.github/workflows/sync-ai-data.yml` - daily sync that overwrites `llms-full.txt`, `api/*.json`, and `projects/*.md` from Yobi; do not hand-edit those files, edits get clobbered on the next run. It only writes those exact filenames and never deletes, so hand-maintained files that live alongside them (`api/llms.txt`, `projects/llms.txt`) are safe.

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
- `vercel.json` - serves `/index.md` for `GET /?mode=agent` and for `GET /` with `Accept: text/markdown`, and sets the `Link` and `Vary` response headers on `/`.

Facts in these files must be verifiable. Check licences against the GitHub API and install commands against `api/projects.json` or the project's own README rather than guessing. Do not publish a manifest for a service that does not exist; there is no MCP server, no A2A endpoint, and no write API on this domain.

## Commands

```bash
npm run prep
npm run dev
npm run build
```

`npm run prep` installs Ruby dependencies through Bundler. `npm run build` runs `bundle exec jekyll build`.

## Content Rules

- Chinese posts live in `_posts/`, English posts in `_posts_en/`, both named `YYYY-MM-DD-{topic}.md` (no `.en` suffix; the directory is the language marker). Do not mix languages in a single post file.
- Posts are zh/en mirror pairs keyed by identical filenames. When editing a post in `_posts/`, check whether `_posts_en/` has the same file and apply the equivalent change there (and vice versa). A few Chinese posts intentionally have no English mirror; do not create one unless asked.
- Required frontmatter: `layout`, `title`, `date`. Preserve all existing frontmatter fields; do not drop keys.
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
- Frontmatter edits: confirm the page builds and appears in the expected language/feed.
- Documentation-only changes: check links and commands.

## GitHub Operations

- Use `gh` for issue and PR inspection.
- Do not post public comments unless the maintainer explicitly asks.
- Draft public replies in the same language as the thread.
