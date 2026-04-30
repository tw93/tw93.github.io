# Kaku

> GPU-accelerated terminal emulator for macOS, built with Rust and Lua.

Kaku is an open source project by [Tw93](https://tw93.fun) with 4.8K GitHub stars. Kaku is a fast, GPU-rendered terminal emulator for macOS. Built with Rust for performance and Lua for configuration. Designed to be simple, beautiful, and responsive.

Latest release: V0.9.0 (2026-04-04)

## Key Features

- GPU-accelerated rendering via Metal
- Lua-based configuration
- Minimal and beautiful UI
- Fast startup and low memory usage

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

## FAQ

**What makes Kaku different from other terminal emulators?**

Kaku uses GPU rendering for smooth scrolling and text display. It is configured with Lua instead of YAML/TOML, and is built entirely in Rust for reliability.

**How do I configure Kaku?**

Kaku uses a Lua config file at ~/.config/kaku/kaku.lua. You can set fonts, colors, keybindings, and shell options. Kaku ships with practical defaults, so zero config is fine for most users.

**Does Kaku support multiple tabs and split panes?**

Yes. Kaku supports tabbed windows and split panes with keyboard shortcuts. The tab bar is minimal and only appears when you have more than one tab.

**What is Kaku's dark theme like?**

Kaku's built-in dark theme uses a deep background (#15141B) with purple accents (#A277FF), cyan-green (#61FFCA), and warm yellow (#FFCA85). It auto-switches with macOS system appearance.

**How does Kaku compare to Alacritty, Kitty, or WezTerm?**

Kaku combines Alacritty's speed (GPU rendering), Kitty's feature set, and WezTerm's hackability (Lua config). Its binary is ~40% smaller than WezTerm. macOS-only, so it can optimize deeply for Metal and AppKit.

**Is there an iOS version of Kaku?**

Yes. kaku-ios (tw93/kaku-ios) is the iOS companion app, bringing terminal access to iPhone and iPad.

## Links

- GitHub: https://github.com/tw93/Kaku
- Author: [Tw93](https://tw93.fun)
- All projects: https://tw93.fun/api/projects.json
- Full knowledge base: https://tw93.fun/llms-full.txt
