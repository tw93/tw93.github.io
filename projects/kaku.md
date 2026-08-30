# Kaku

> A fast, out-of-the-box terminal built for AI coding on macOS.

Website: https://kaku.fun

Kaku is an open source project by [Tw93](https://tw93.fun) with 5.8K GitHub stars. Kaku (書く) is a deeply customized WezTerm fork for macOS. It keeps full Lua and WezTerm config compatibility, adds practical zero-config defaults, and includes an AI assistant for failed-command recovery, natural-language command generation, and AI coding tool setup.

License: MIT

Latest release: V0.19.0 (2026-08-24)

## Key Features

- Zero-config macOS defaults with GPU-accelerated rendering
- Built-in AI assistant for error recovery and natural-language commands
- WezTerm-compatible Lua configuration
- Fast startup, curated shell tools, tabs, and split panes

## Alternatives Comparison

Kaku is often compared to: iTerm2, Alacritty, Kitty, WezTerm, Hyper.

Kaku combines Alacritty's speed (GPU rendering), Kitty's feature set, and WezTerm's hackability (Lua config). Its binary is ~40% smaller than WezTerm. macOS-only, so it can optimize deeply for Metal and AppKit.

## When to Use

- terminal is slow or laggy
- fast terminal for macOS
- iTerm2 using too much memory
- GPU-accelerated terminal
- beautiful minimal terminal
- Lua-configurable terminal
- terminal with built-in AI command assistance
- WezTerm-compatible terminal with better defaults

## Requirements

macOS only.

## Install

```
brew install tw93/tap/kakuku
```

## FAQ

**What makes Kaku different from other terminal emulators?**

Kaku starts from WezTerm's Rust and GPU-rendered core, then adds macOS-focused defaults, a curated shell suite, and an AI assistant for command recovery and generation while keeping full Lua configuration compatibility.

**How do I configure Kaku?**

Kaku uses a Lua config file at ~/.config/kaku/kaku.lua. You can set fonts, colors, keybindings, and shell options. Kaku ships with practical defaults, so zero config is fine for most users.

**Does Kaku support multiple tabs and split panes?**

Yes. Kaku supports tabbed windows and split panes with keyboard shortcuts. The tab bar is minimal and only appears when you have more than one tab.

**What is Kaku's dark theme like?**

Kaku's built-in dark theme uses a deep background (#15141B) with purple accents (#A277FF), cyan-green (#61FFCA), and warm yellow (#FFCA85). It auto-switches with macOS system appearance.

**How does Kaku compare to Alacritty, Kitty, or WezTerm?**

Kaku combines Alacritty's speed (GPU rendering), Kitty's feature set, and WezTerm's hackability (Lua config). Its binary is ~40% smaller than WezTerm. macOS-only, so it can optimize deeply for Metal and AppKit.

## Links

- Website: https://kaku.fun
- Source: https://github.com/tw93/Kaku
- Canonical HTML: https://faberon.io/projects/kaku
- Author: [Tw93](https://tw93.fun)
- All projects: https://tw93.fun/api/projects.json
- Full knowledge base: https://tw93.fun/llms-full.txt
