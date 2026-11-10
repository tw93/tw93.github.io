---
paths:
  - "llms.txt"
  - "index.md"
  - "pricing.md"
  - "openapi.json"
  - ".well-known/**"
  - "api/**"
  - "projects/**"
  - "schema-map.xml"
  - "sitemap-ai.xml"
  - "_includes/head.html"
  - "en/about.md"
  - "_plugins/markdown_twins.rb"
  - "vercel.json"
  - ".github/workflows/sync-ai-data.yml"
---

These files exist so AI agents and crawlers can use the site without scraping HTML. The hand-maintained surfaces repeat facts that also live in `llms.txt`; when a project, price, or licence changes, update those copies together and change generated surfaces at their upstream source, as listed below.

Price is the fact most expensive to get wrong and the most scattered, so do not reconstruct the list from memory. Run `rg --hidden -l '\$19|one-time|14-day' . --glob '!AGENTS.md' --glob '!_site/**' --glob '!.git/**' --glob '!.claude/**' --glob '!.jekyll-cache/**' --glob '!node_modules/**' --glob '!vendor/**'`. It returns sixteen files while excluding local worktrees, caches, and dependencies. Three only mention a price in passing and are not price sources: `_data/notes.json` (old posts on X), `api/weekly.json` and `_posts_en/2026-10-22-desktop.md`. Five fix themselves because Yobi overwrites them (`llms-full.txt`, `api/projects.json`, `projects/mole.md`, `projects/mole-mac.md`, `projects/mole-windows.md`), so change the price in Yobi's `data/projects.ts` first and let the sync land. The remaining eight are hand-edits: `pricing.md`, `llms.txt`, `index.md`, `projects/llms.txt`, `_includes/head.html`, `openapi.json`, `.well-known/ai-plugin.json`, and `en/about.md`. That last one is a normal page rather than an agent surface, which is why it is the one that gets missed.

The project count scatters the same way. When a project is added or retired, run `rg --hidden -n '[0-9]+K\+ GitHub stars|[Aa]ll [0-9]+ projects' . --glob '!_site/**' --glob '!llms-full.txt' --glob '!.git/**' --glob '!.claude/**'`. Everything it returns outside those two star sentences is a hand-edit: `index.md`'s endpoint table, `openapi.json`, `.well-known/agent.json`, `api/llms.txt`, and `projects/llms.txt`, which also carries the secondary count. `api/profile.json` `projectCount` and its `tiers` are the authority.

- `llms.txt` - orientation file, the entry point. `llms-full.txt` is machine-generated, do not edit.
- `index.md` and `pricing.md` - static markdown at the repo root, no front matter so Jekyll copies them verbatim. Do not add front matter or they turn into HTML pages and the URLs break.
- `openapi.json` - OpenAPI 3.1 description of the read-only endpoints. Verify with `npx @redocly/cli lint openapi.json` after editing.
- `.well-known/` - `ai-plugin.json`, `agent.json`, and `api-catalog` (RFC 9727, extensionless). Listed in `_config.yml` `include:` because Jekyll skips dot-directories.
- `api/llms.txt`, `projects/llms.txt` - scoped context for those two directories.
- Post Markdown surfaces, written into `_site` by `_plugins/markdown_twins.rb` on every build and never committed: a `.md` twin beside every post (`/2026-10-22/desktop.md`), `/posts.md` and `/en/posts.md`, `/api/posts.json`, and `/api/posts.jsonl` / `/api/en/posts.jsonl` with each post's full Markdown. They come from the post source kept at `:post_read`, because by `:post_write` the content is HTML; they are plain files rather than Jekyll pages, because a `.md` page would be converted to HTML and Liquid would eat the `{{ }}` in code samples. PPT posts are left out. The daily Yobi sync only overwrites the `api/*.json` files it fetches, so it never touches these. `vercel.json` gives them their content types and 302s a post's `.html` with `Accept: text/markdown` to its `.md`.
- `schema-map.xml` - structured data feed list, discoverable through `sitemap-ai.xml`. Keep `Schemamap:` out of `robots.txt`: Search Console flags it as a syntax error, and the sitemap submitted while it was there stayed "Couldn't fetch" (2026-10-15).
- `sitemap-ai.xml` - sitemap for every surface above; new project briefs land here automatically, new root-level files need an explicit entry.
- `_includes/head.html` - the homepage JSON-LD `@graph` (Person, Organization, SoftwareApplication per project). Prices here must match `pricing.md`.
- `vercel.json` - 302s `GET /?mode=agent` and `GET /` with `Accept: text/markdown` to `/index.md`, and sets the `Link` and `Vary` response headers on `/`. These must stay `redirects`, not `rewrites`: Vercel checks the filesystem before applying rewrites, `/` already matches `index.html`, so a rewrite on `/` never fires. Verify after deploying, not just locally. `vercel.json` takes no comment keys, the published schema rejects unknown top-level properties.

Facts in these files must be verifiable. Check licences against the GitHub API and install commands against `api/projects.json` or the project's own README rather than guessing. Do not publish a manifest for a service that does not exist; there is no MCP server, no A2A endpoint, and no write API on this domain.
