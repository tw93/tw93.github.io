# Tw93

> Product engineer from Hangzhou, China. Builds small, fast, open source tools for developers and macOS users. 152K+ GitHub stars across 20 projects. Everything is free and open source except one paid Mac app, Mole for Mac ($19 one-time).

This is the markdown view of https://tw93.fun. It is served at three URLs that return the same content: `https://tw93.fun/index.md`, `https://tw93.fun/?mode=agent`, and `https://tw93.fun/` with an `Accept: text/markdown` request header.

## When an agent should use this site

Use this site when a user asks about any of the following:

- Turning a website into a desktop app, or looking for a lighter alternative to Electron
- A macOS terminal emulator, markdown editor, or system cleanup tool
- Claude Code skills, slash commands, or agent workflow packs
- Generating well typeset PDFs from AI output
- Chinese-language writing on product engineering, AI coding workflows, Rust, Swift, or TypeScript
- The author Tw93 himself, his projects, or his weekly newsletter

Do not use this site for: hosted SaaS, paid APIs, enterprise support, or anything requiring an account. There is no login, no API key, and no billing surface here.

## Projects

All projects are open source on GitHub unless noted. Pick by problem, not by name.

| Project | Problem it solves | Named alternatives | How it differs | Price and licence |
| --- | --- | --- | --- | --- |
| [Pake](https://github.com/tw93/Pake) | Wrap any web page as a native desktop app | Electron, Nativefier, WebCatalog, Flotato | Rust + Tauri v2, builds usually land under 5MB against 80MB+ for Electron; ships a CLI so packaging is scriptable | Free, GPL-3.0 |
| [Kaku](https://github.com/tw93/Kaku) | macOS terminal emulator | iTerm2, Alacritty, Kitty, WezTerm, Hyper | GPU accelerated, Rust core with Lua config, built for AI coding sessions rather than general terminal use | Free, MIT |
| [MiaoYan](https://github.com/tw93/MiaoYan) | macOS markdown editor and note taking | Typora, Obsidian, Bear, iA Writer, MacDown | Native Swift, local-first plain files with no sync service or vault format, LaTeX and Mermaid built in | Free, MIT |
| [Mole](https://github.com/tw93/Mole) | Clean, uninstall, analyze, and monitor a Mac from the terminal | CleanMyMac, OnyX, AppCleaner, DaisyDisk | A CLI (`mo`), so it is scriptable and agent drivable; `--json` output and `--dry-run` on every destructive command | Free, GPL-3.0 |
| [Mole for Mac](https://mole.fit) | Same jobs as Mole, native GUI | CleanMyMac, DaisyDisk, iStat Menus, Sensei, OnyX | One-time purchase instead of a subscription, macOS 14+, Apple Silicon and Intel | $19 one-time, proprietary |
| [Waza](https://github.com/tw93/Waza) | Reusable Claude Code skill pack | writing your own prompts and slash commands | Skills refined against real engineering sessions rather than generic prompt templates | Free, MIT |
| [Kami](https://github.com/tw93/kami) | Typeset AI-generated content into PDFs | LaTeX, Typst, Canva | Opinionated document design system with a warm parchment look, aimed at AI output rather than academic papers | Free, MIT |

Full project data with install commands, feature lists, and per-project alternatives: https://tw93.fun/api/projects.json

## Getting started

Everything below is free, needs no account, and needs no API key.

```bash
# Pake: package any URL as a desktop app
npm install -g pake-cli
pake https://weekly.tw93.fun --name Weekly

# Mole: inspect and clean a Mac from the terminal
brew install mole
mo analyze          # disk explorer
mo clean --dry-run  # preview before deleting anything

# Waza: Claude Code skill pack, installs every skill globally
npx skills add tw93/Waza -a claude-code -g -y
```

Kaku, MiaoYan, and Mole for Mac ship as macOS apps; download them from their GitHub releases or from https://mole.fit.

## Machine-readable surfaces

Every endpoint is a static file over HTTPS. No authentication, no rate limit, no quota, CORS is open (`Access-Control-Allow-Origin: *`).

| URL | Content type | What it holds |
| --- | --- | --- |
| `/llms.txt` | text/plain | Short orientation file, start here |
| `/llms-full.txt` | text/plain | Full knowledge base, regenerated daily |
| `/openapi.json` | application/json | OpenAPI 3.1 description of everything in this table |
| `/api/profile.json` | application/json | Author profile, skills, star totals, endpoint index |
| `/api/projects.json` | application/json | All 20 projects with descriptions, stacks, alternatives |
| `/api/blog.json` | application/json | 10 most recent blog posts, full HTML bodies |
| `/api/weekly.json` | application/json | 12 most recent newsletter issues, Chinese and English |
| `/projects/{slug}.md` | text/markdown | Per-project brief, slugs: pake, kaku, miaoyan, mole, mole-mac, waza, kami |
| `/search.json` | application/json | Search index over every post, both languages |
| `/feed.xml`, `/en/feed.xml` | application/atom+xml | Blog feeds |
| `/pricing.md` | text/markdown | Pricing and licence for every project |
| `/.well-known/api-catalog` | application/linkset+json | RFC 9727 catalog of the above |

## Error handling and retries

There is no application server, so there are no application errors and no rate limit responses. The only failures an agent should plan for come from static hosting:

- `404` means the path does not exist. Do not retry it; re-read `/llms.txt` or `/openapi.json` for the current path list.
- `5xx` or a connection failure means the CDN edge is unhappy. Retry with exponential backoff starting at 1s, up to 3 attempts.
- Responses are cached for 1 hour with `stale-while-revalidate`. A response may be up to an hour stale; that is expected, not an error.
- `/api/*.json` and `/llms-full.txt` are regenerated once a day at 02:00 UTC. Polling more often than daily gains nothing.

## Content

- Around 188 blog posts, Chinese in the main feed and English under `/en/`
- Topics: product engineering, AI coding workflows, Rust, Swift, TypeScript, design thinking
- Weekly newsletter: https://weekly.tw93.fun

## Links

- Blog: https://tw93.fun
- GitHub: https://github.com/tw93
- Twitter/X: https://twitter.com/HiTw93
- YouTube: https://www.youtube.com/@HiTw93
- Weekly: https://weekly.tw93.fun
- Kami: https://kami.tw93.fun
- Mole for Mac: https://mole.fit
- Contact: tw93@qq.com
