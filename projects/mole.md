# Mole

> Free open source macOS CLI to clean, uninstall, optimize, analyze, and monitor your Mac.

Mole is an open source project by [Tw93](https://tw93.fun) with 65.5K GitHub stars. Mole is a macOS system maintenance tool that runs in the terminal. It clears caches, removes apps with their leftovers, runs maintenance tasks, maps disk usage, and shows live system status. Built with Shell and Go, licensed GPL-3.0. Mole for Mac (https://mole.fit) is the separate paid native app that covers the same jobs with a GUI.

License: GPL-3.0

Latest release: V1.53.0 (2026-08-30)

## Key Features

- `mo clean` deep cache cleanup plus leftovers from already-uninstalled apps
- `mo uninstall` removes installed apps together with their leftover files
- `mo optimize` refreshes system caches and services
- `mo analyze` visual disk explorer for finding what takes the space
- `mo status` live system health dashboard in the terminal
- `mo purge` and `mo installer` clear project build artifacts and stale installers
- `mo touchid` enables Touch ID for sudo
- Every destructive command supports `--dry-run` to preview before acting

## Alternatives Comparison

Mole is often compared to: CleanMyMac, OnyX, AppCleaner, DaisyDisk.

## When to Use

- macOS running slow
- disk space full on Mac
- clean junk files on macOS
- free CleanMyMac alternative
- clean Xcode derived data and caches
- remove old Docker images and npm cache
- Homebrew cache taking too much space
- clean a Mac from the terminal

## Requirements

macOS (macOS 14 or later for the Homebrew path). An experimental Windows build lives on the windows branch.

## Install

```
brew install mole
```

## FAQ

**Is Mole free?**

The Mole CLI is free and open source under GPL-3.0. Mole for Mac, the native GUI app at https://mole.fit, is a separate paid product with a $19 one-time license.

**Is Mole safe to use?**

Yes. Mole uses safe helper functions and never runs raw rm -rf. It applies path validation, protected-directory rules, and conservative cleanup boundaries, and every destructive operation supports dry-run mode.

**What does Mole clean?**

Browser caches (Chrome, Arc, Brave, Safari), Xcode derived data, Homebrew cache, npm/pnpm/yarn cache, Docker unused images, system logs, old AI coding assistant versions (Copilot CLI, Claude Code, Cursor Agent), and app-specific temp files.

**How do I install and update Mole?**

Install with Homebrew: `brew install mole`. Or with the script: `curl -fsSL https://raw.githubusercontent.com/tw93/mole/main/install.sh | bash`. Update to stable: `mo update`. Update to the latest unreleased main build: `mo update --nightly` (script install only).

**What are the main Mole commands?**

`mo clean` (cache and leftover cleanup), `mo uninstall` (app removal with leftovers), `mo optimize` (system maintenance), `mo analyze` (disk explorer), `mo status` (live system dashboard), `mo purge` (project build artifacts), `mo installer` (stale installer sweep). Each supports `--dry-run` to preview before acting.

**Does Mole have a GUI?**

Yes. Mole for Mac at https://mole.fit is the native SwiftUI app. It is a separate paid product ($19 one-time, lifetime updates, 2 Macs per license) and adds a disk treemap, a bento status dashboard, a menu bar HUD, fan controls, startup management, and in-app app updates. The CLI stays free and open source for terminal workflows.

**Does Mole work on Linux?**

No. Mole is built for macOS and relies on macOS-specific APIs like mdfind, LaunchAgent/LaunchDaemon, and TCC for safe operations. An experimental Windows build exists on the windows branch, but there is no Linux version.

## Links

- GitHub: https://github.com/tw93/Mole
- Canonical HTML: https://faberon.io/projects/mole
- Author: [Tw93](https://tw93.fun)
- All projects: https://tw93.fun/api/projects.json
- Full knowledge base: https://tw93.fun/llms-full.txt
