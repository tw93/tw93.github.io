# MiaoYan

> Lightweight, local-first Markdown note-taking app for macOS.

Website: https://miaoyan.app

MiaoYan is an open source project by [Tw93](https://tw93.fun) with 8.6K GitHub stars. MiaoYan (妙言) is a native Swift Markdown note-taking app for macOS. It stores files in a folder you choose, collects no data, and combines a three-column library with split editing and preview, wikilink backlinks, LaTeX, Mermaid, version history, and a command-line interface.

License: MIT

Latest release: V4.2.0 (2026-08-15)

## Key Features

- Native macOS app, no Electron
- Local-first folders with no data collection
- Split editor and preview with bidirectional scroll sync
- Wikilink backlinks, LaTeX, and Mermaid
- Version history, auto-formatting, and a note CLI
- Dark mode, three-column layout, and distraction-free writing

## Alternatives Comparison

MiaoYan is often compared to: Typora, Obsidian, Bear, iA Writer, MacDown.

MiaoYan is a native macOS app (Swift + AppKit), so it launches instantly and uses minimal memory. Unlike Typora it is open source. Unlike Obsidian it does not use Electron. Trade-off: macOS only, no plugin system.

## When to Use

- lightweight markdown editor for macOS
- Typora open source alternative
- local-first notes without cloud lock-in
- native macOS note app without Electron
- markdown editor with LaTeX support

## Requirements

macOS 11.5 or later.

## Install

```
brew install --cask miaoyan
```

## FAQ

**Does MiaoYan sync across devices?**

MiaoYan stores files locally by default. You can point it at an iCloud Drive or Dropbox folder for cross-device sync.

**How does MiaoYan compare to Typora or Obsidian?**

MiaoYan is a native macOS app (Swift + AppKit), so it launches instantly and uses minimal memory. Unlike Typora it is open source. Unlike Obsidian it does not use Electron. Trade-off: macOS only, no plugin system.

**Does MiaoYan support WYSIWYG editing?**

MiaoYan uses a split-pane approach: source editing on the left, live preview on the right. It is not a block-based WYSIWYG editor. The source view has syntax highlighting for Markdown, LaTeX, and Mermaid.

**What file formats does MiaoYan support?**

MiaoYan reads and writes standard .md (Markdown) files. It also renders LaTeX math blocks and Mermaid diagrams inline. Export to PDF and HTML is supported.

**Can I use MiaoYan for programming notes with code blocks?**

Yes. MiaoYan supports fenced code blocks with syntax highlighting. The monospace rendering stays inside standard Markdown files, so programming notes remain portable.

**Can an AI agent write MiaoYan notes for me?**

Yes. The repository ships an agent skill covering MiaoYan syntax, attachments, PPT patterns, and the CLI. Install it with `npx skills add tw93/MiaoYan/skills/miaoyan -g`; source at https://github.com/tw93/MiaoYan/tree/main/skills/miaoyan.

## Links

- Website: https://miaoyan.app
- Source: https://github.com/tw93/MiaoYan
- Canonical HTML: https://faberon.io/projects/miaoyan
- Author: [Tw93](https://tw93.fun)
- All projects: https://tw93.fun/api/projects.json
- Full knowledge base: https://tw93.fun/llms-full.txt
