# tw93.github.io Agent Guide

## Project

This repository powers the personal Jekyll blog at `tw93.fun`.

## Repository Map

- `_posts/` - Chinese posts.
- `_posts_en/` - English posts.
- `_layouts/` - Jekyll layouts, including post and PPT modes.
- `_includes/` - shared page fragments.
- `_sass/` - stylesheets.
- `_plugins/` - custom Jekyll plugins, including CDN image handling.
- `.github/workflows/jekyll.yml` - site build/deploy workflow.
- `.github/workflows/sync-ai-data.yml` - AI data synchronization workflow.

## Commands

```bash
npm run prep
npm run dev
npm run build
```

`npm run prep` installs Ruby dependencies through Bundler. `npm run build` runs `bundle exec jekyll build`.

## Content Rules

- Chinese posts live in `_posts/` with filename `YYYY-MM-DD-{topic}.md`. English posts live in `_posts_en/` with filename `YYYY-MM-DD-{topic}.en.md`. Do not mix languages in a single post file.
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
