# Kami

> Document design system for AI-generated PDFs with warm parchment typography.

Website: https://kami.tw93.fun

Kami is an open source project by [Tw93](https://tw93.fun) with 11.0K GitHub stars. Kami is a document design system that produces beautifully typeset PDFs. It uses a warm parchment aesthetic with ink-blue accents, serif-led hierarchy, and tight editorial spacing. One constraint language covers eight document templates plus a landing-page system, strict enough that an agent's output is shippable without hand fixing. Supports Chinese, English, and Japanese typography.

License: MIT

Latest release: V1.13.0 (2026-08-23)

## Key Features

- Warm parchment design system with ink-blue accents
- Trilingual typography (Chinese, English, Japanese)
- Eight document templates plus a landing-page system
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

Resumes, one-pagers, white papers, letters, portfolios, and slide decks, plus product landing pages. It handles Chinese, English, and Japanese with appropriate typefaces.

**How do I install Kami?**

Kami has its own plugin marketplace, separate from Waza. In Claude Code (v2.1.142 or newer) run `/plugin marketplace add tw93/kami` then `/plugin install kami@kami`. Codex has an equivalent marketplace command. You then describe what you want and Kami generates a typeset HTML document that exports to PDF, image, or slide deck.

**What is Kami's design aesthetic?**

Warm parchment background with ink-blue (#1B365D) accents, Charter serif for English, TsangerJinKai02 + Source Han for Chinese. Tight editorial spacing with clear visual hierarchy.

**Does Kami support charts and diagrams?**

Yes. Kami supports 12 types of inline SVG charts (bar, line, pie, area, architecture diagrams, etc.) with colors that match the parchment design system. Charts are automatically inserted when the content benefits from visualization.

**What languages does Kami support for typesetting?**

Chinese, English, and Japanese. Each language has carefully selected fonts, letter-spacing, line-height, and font-size tuned for print-quality output.

## Links

- Website: https://kami.tw93.fun
- Source: https://github.com/tw93/Kami
- Canonical HTML: https://faberon.io/projects/kami
- Author: [Tw93](https://tw93.fun)
- All projects: https://tw93.fun/api/projects.json
- Full knowledge base: https://tw93.fun/llms-full.txt
