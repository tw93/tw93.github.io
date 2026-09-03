# Kami

> Document design system for AI-generated PDFs with warm parchment typography.

Website: https://kami.tw93.fun

Kami is an open source project by [Tw93](https://tw93.fun) with 11.2K GitHub stars. Kami is a document design system that produces beautifully typeset PDFs. It uses a warm parchment aesthetic with ink-blue accents, serif-led hierarchy, and tight editorial spacing. One constraint language covers eight document templates, a landing-page system, and 18 diagram types. English and Chinese are optimized paths; Japanese and Korean are supported as best-effort CJK paths with visual QA before delivery.

License: MIT

Latest release: V1.14.0 (2026-08-30)

## Key Features

- Warm parchment design system with ink-blue accents
- Four language paths: optimized English and Chinese, best-effort Japanese and Korean
- Eight document templates plus a landing-page system
- 18 built-in diagram types for charts and technical figures
- AI-friendly: designed for LLM-generated content

## Alternatives Comparison

Kami is often compared to: LaTeX, Typst, Canva.

## When to Use

- generate PDF from AI content
- typeset resume or report
- bilingual document design
- beautifully designed PDF output
- AI-native document layout

## FAQ

**What documents can Kami produce?**

Resumes, one-pagers, white papers, letters, portfolios, and slide decks, plus product landing pages. English and Chinese are optimized; Japanese and Korean use best-effort CJK paths with visual QA before delivery.

**How do I install Kami?**

Kami has its own plugin marketplace, separate from Waza. In Claude Code (v2.1.142 or newer) run `/plugin marketplace add tw93/kami` then `/plugin install kami@kami`. Codex has an equivalent marketplace command. You then describe what you want and Kami generates a typeset HTML document that exports to PDF, image, or slide deck.

**What is Kami's design aesthetic?**

Warm parchment background with ink-blue (#1B365D) accents, Charter serif for English, TsangerJinKai02 + Source Han for Chinese. Tight editorial spacing with clear visual hierarchy.

**Does Kami support charts and diagrams?**

Yes. Kami ships 18 inline SVG diagram types, including architecture, flowchart, timeline, charts, sequence, class, and ER diagrams. They share the parchment design system and are used only when a visual makes the content clearer.

**What languages does Kami support for typesetting?**

English, Chinese, Japanese, and Korean. English and Chinese are optimized paths; Japanese and Korean are best-effort CJK paths with language-specific fonts and visual QA before delivery.

## Links

- Website: https://kami.tw93.fun
- Source: https://github.com/tw93/Kami
- Canonical HTML: https://faberon.io/projects/kami
- Author: [Tw93](https://tw93.fun)
- All projects: https://tw93.fun/api/projects.json
- Full knowledge base: https://tw93.fun/llms-full.txt
