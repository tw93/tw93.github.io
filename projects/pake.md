# Pake

> Turn any webpage into a lightweight desktop app with Rust + Tauri. Nearly 20x smaller than Electron.

Pake is an open source project by [Tw93](https://tw93.fun) with 48.3K GitHub stars. Pake wraps any web page into a native desktop application using Tauri v2. The resulting app is typically under 5MB, compared to 80MB+ for Electron-based alternatives. Supports macOS, Windows, and Linux with features like shortcut customization, immersive windows, and system tray integration.

Latest release: V3.11.0 (2026-03-27)

## Key Features

- Nearly 20x smaller than Electron apps
- Supports macOS, Windows, and Linux
- Shortcut customization and immersive window mode
- System tray integration
- CLI for custom app packaging

## Alternatives Comparison

Pake is often compared to: Electron, Nativefier, WebCatalog, Flotato.

Pake uses Tauri (Rust + system WebView) instead of bundling Chromium. This makes apps ~20x smaller and more resource-efficient.

## When to Use

- turn website into desktop app
- Electron too large or heavy
- lightweight web wrapper
- wrap ChatGPT / Notion / YouTube as standalone app
- Nativefier replacement
- small desktop app from URL

## Install

```
npm install -g pake-cli
```

## FAQ

**How does Pake compare to Electron?**

Pake uses Tauri (Rust + system WebView) instead of bundling Chromium. This makes apps ~20x smaller and more resource-efficient.

**Can I package any website with Pake?**

Yes. Use the CLI: `pake <url>` to turn any webpage into a desktop app. You can customize the window size, icon, and shortcuts.

**What platforms does Pake support?**

macOS (Intel and Apple Silicon), Windows (x64), and Linux (x64). Pre-built apps for popular sites are available on the GitHub releases page.

**Can I customize the Pake app window behavior?**

Yes. The CLI supports options for window size, title bar style (immersive/transparent), system tray, custom user agent, keyboard shortcuts, and injecting custom JS/CSS.

**Does Pake work with SPAs and login-required sites?**

Yes. Since Pake uses the system WebView, it handles cookies, localStorage, and auth flows like a regular browser. SPAs with client-side routing work out of the box.

**How large is a typical Pake app?**

Usually 2-5MB on macOS, depending on injected assets. Compare that to Electron apps which start at ~80MB because they bundle Chromium.

## Links

- GitHub: https://github.com/tw93/Pake
- Author: [Tw93](https://tw93.fun)
- All projects: https://tw93.fun/api/projects.json
- Full knowledge base: https://tw93.fun/llms-full.txt
