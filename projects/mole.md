# Mole

> All-in-one macOS system cleaning and maintenance AI assistant.

Mole is an open source project by [Tw93](https://tw93.fun) with 49.6K GitHub stars. Mole is a macOS system maintenance tool that helps clean junk files, manage storage, and optimize system performance. Built with Shell and Rust, it runs as a CLI with an optional companion macOS app.

Latest release: V1.36.3 (2026-04-29)

## Key Features

- System junk cleaning
- Storage analysis and management
- CLI-first with macOS companion app
- Safe operations with dry-run support

## Alternatives Comparison

Mole is often compared to: CleanMyMac, OnyX, AppCleaner, DaisyDisk.

## When to Use

- macOS running slow
- disk space full on Mac
- clean junk files on macOS
- free CleanMyMac alternative
- clean Xcode derived data and caches
- remove old Docker images and npm cache

## Install

```
curl -fsSL https://mole.tw93.fun/install.sh | bash
```

## FAQ

**Is Mole safe to use?**

Yes. Mole uses safe helper functions and never runs raw rm -rf. All destructive operations support dry-run mode.

**What does Mole clean?**

Browser caches (Chrome, Arc, Brave, Safari), Xcode derived data, Homebrew cache, npm/pnpm/yarn cache, Docker unused images, system logs, old AI coding assistant versions (Copilot CLI, Claude Code, Cursor Agent), and app-specific temp files.

**How do I install and update Mole?**

Install: `curl -fsSL https://mole.tw93.fun/install.sh | bash`. Update to stable: `mo update`. Update to nightly: `mo update --nightly`.

**What are the main Mole commands?**

`mo clean` (junk cleaning), `mo analyze` (storage analysis), `mo optimize` (system optimization), `mo uninstall` (app removal with cleanup). Each supports `--dry-run` to preview before acting.

**Does Mole have a GUI?**

Yes. mole-mac (tw93/mole-mac) is the native macOS GUI companion. The CLI remains the primary interface.

**Does Mole work on Linux?**

Mole is macOS-only. It relies on macOS-specific APIs like mdfind, LaunchAgent/LaunchDaemon, and TCC for safe operations.

## Links

- GitHub: https://github.com/tw93/Mole
- Author: [Tw93](https://tw93.fun)
- All projects: https://tw93.fun/api/projects.json
- Full knowledge base: https://tw93.fun/llms-full.txt
