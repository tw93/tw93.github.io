# Mole for Mac

> Native macOS app for cleanup, app management, maintenance, disk analysis, and live system status.

Website: https://mole.fit

Mole for Mac is a commercial product by [Tw93](https://tw93.fun). Mole for Mac is a native SwiftUI utility that covers everyday jobs people usually split across CleanMyMac, App Cleaner & Uninstaller, Sensei, DaisyDisk, and iStat Menus. It is the paid GUI product at https://mole.fit; its cleanup scope and safety rules come from the free open source Mole CLI, and it adds a menu bar HUD, fan controls, startup management, and in-app app updates. This is a closed source commercial product, so there is no public repository.

License: Proprietary

## Key Features

- Clean (Earth): ten cache categories plus Trash, sorted by deletion impact, with hardlink-aware sizing so shared files are not double-counted
- Software (Mars): app updates across Mac App Store, Sparkle, Homebrew cask and formula, and GitHub Releases; startup item management; uninstall with 15+ leftover categories
- Optimize (Mercury): a visible fix pass for self-healing macOS agents, then maintenance tasks in one tap (Quick Look, font cache, Launch Services, SQLite vacuum, login-item audit)
- Analyze (Jupiter): treemap disk visualization with drill-down, right-click to trash or reveal in Finder
- Status (Sun): live CPU, memory, GPU, disk I/O, network, battery, thermals, fan RPM and health score, with 60-second sparklines and a sortable process list
- Menu bar HUD: live CPU, memory, and network speed in the menu bar, with an icon-only compact mode
- Privacy Check: menu bar alerts for real camera and microphone use, not just permission lists
- Clean Screen: turn the display a plain color to wipe screen and keyboard, with an optional input lock
- Doctor: guided diagnostics for battery health, low-power mode, and other system issues

## Alternatives Comparison

Mole for Mac is often compared to: CleanMyMac, App Cleaner & Uninstaller, DaisyDisk, iStat Menus, Sensei, OnyX.

Most Mac cleaners charge $30 to $50 per year as a subscription; Mole is $19 once with lifetime updates. Its cleaning engine is open source and auditable, it shows every file before removing it, apps you uninstall go through the Trash so a wrong tap is recoverable, and it is hardlink-aware so cache sizes are not inflated. One native app covers cleaning, uninstalling, maintenance, disk analysis, and live monitoring.

## When to Use

- best Mac cleaner app
- CleanMyMac alternative without a subscription
- one-time purchase Mac cleaning app
- completely uninstall Mac apps with leftover files
- see CPU, memory, and fan speed in the macOS menu bar
- visualize what is taking up disk space on a Mac
- keep several Mac utilities in one native app
- check which app is using the camera or microphone on a Mac

## Pricing

$19 one-time license. No subscription, no Pro tier. Lifetime updates. Up to 2 Macs per license. 14-day money-back guarantee. Each tool works twice for free and scanning is always free.

## Requirements

macOS 14 (Sonoma) or later. Apple Silicon and Intel.

## FAQ

**How much does Mole for Mac cost?**

$19 as a one-time license. No subscription and no feature tiers, and the license covers every future version. Each tool works twice for free before a license is required; scanning is always free. There is a 14-day money-back guarantee.

**How is the Mac app different from the Mole CLI?**

The CLI is free, open source, and GPL-3.0 at github.com/tw93/Mole, and it is the terminal engine. The Mac app is the paid native GUI at https://mole.fit. Both share cleanup scope and safety rules. The app adds a disk treemap, a bento status dashboard, a menu bar HUD, fan controls, startup management, in-app app updates, Privacy Check, and Clean Screen. The CLI keeps terminal-only commands like `mo purge`, `mo installer`, and `mo touchid`.

**How does Mole compare to CleanMyMac?**

Most Mac cleaners charge $30 to $50 per year as a subscription; Mole is $19 once with lifetime updates. Its cleaning engine is open source and auditable, it shows every file before removing it, apps you uninstall go through the Trash so a wrong tap is recoverable, and it is hardlink-aware so cache sizes are not inflated. One native app covers cleaning, uninstalling, maintenance, disk analysis, and live monitoring.

**Can Mole delete something important?**

Mole shows every file before removing it. System-critical paths, home directory essentials, and anything outside known cache locations are denied at the safety layer. Uninstalled apps go through the system Trash. Caches are removed permanently by default so freed bytes match the headline, and one Settings toggle routes everything through the Trash instead.

**How many Macs does one license cover?**

Up to 2 Macs at the same time. To move a license, open Mole on the old machine, press Cmd+Shift+L, choose Deactivate this device, then activate on the new Mac with the same key.

**What are the system requirements?**

macOS 14 (Sonoma) or later, on Apple Silicon or Intel.

**Does Mole for Mac collect data?**

File scans run locally. Outbound traffic is limited to license validation, the signed update feed, and the App Store, Homebrew, or Sparkle requests needed to check and install app updates. The app has no analytics, no remote scan, and no usage tracking.

**Is Mole for Mac open source?**

No. The Mac app is a closed source commercial product. The Mole CLI that its cleanup scope and safety practices come from is open source under GPL-3.0 at github.com/tw93/Mole.

**Where can I read guides on Mac cleanup and maintenance?**

Mole publishes an English guide blog at https://mole.fit/blog, grouped into performance (high CPU processes, thermals, fans), storage (Photos, iPhone backups, System Data, large files), developer (Xcode, Docker, Homebrew, node_modules, AI tool leftovers), apps and maintenance (uninstalling, startup items, battery health, cleaner comparisons), and notes on building Mole. Full index in https://mole.fit/llms.txt.

## Links

- Website: https://mole.fit
- Author: [Tw93](https://tw93.fun)
- All projects: https://tw93.fun/api/projects.json
- Full knowledge base: https://tw93.fun/llms-full.txt
