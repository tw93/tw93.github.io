# Pricing

Everything Tw93 publishes is free and open source, with two exceptions: Mole for Mac and Mole for Windows, paid native apps.

There is no SaaS, no subscription, no API key, no usage quota, and no enterprise tier. The JSON and markdown endpoints on tw93.fun are free to read without an account.

## Free and open source

| Project | Price | Licence | Where to get it |
| --- | --- | --- | --- |
| [Pake](https://github.com/tw93/Pake) | Free | GPL-3.0 | `npm install -g pake-cli` |
| [Kaku](https://github.com/tw93/Kaku) | Free | MIT | GitHub releases |
| [MiaoYan](https://github.com/tw93/MiaoYan) | Free | MIT | GitHub releases |
| [Mole](https://mole.fit) (CLI, [source](https://github.com/tw93/Mole)) | Free | GPL-3.0 | `brew install mole` |
| [Mole CLI for Windows](https://github.com/tw93/Mole/tree/windows) | Free | GPL-3.0 | `scoop install mole` |
| [Waza](https://github.com/tw93/Waza) | Free | MIT | `npx skills add tw93/Waza -a claude-code -g -y` |
| [Kami](https://github.com/tw93/kami) | Free | MIT | GitHub |
| Blog, weekly newsletter, and all `tw93.fun` data endpoints | Free | Content is the author's | https://tw93.fun/llms.txt |

## Paid

### Mole for Mac

Native macOS app at https://mole.fit. The same jobs as the Mole CLI, with a GUI.

- **Price:** $19, one-time
- **Billing model:** one-time purchase, no subscription and no feature tiers
- **Updates:** lifetime, the licence covers every future version
- **Devices:** up to 2 Macs per licence
- **Free tier:** scanning is always free, and each tool works twice for free before a licence is required
- **Refunds:** 14-day money-back guarantee
- **Requirements:** macOS 14 (Sonoma) or later, Apple Silicon or Intel
- **Licence:** proprietary

### Mole for Windows

Native Windows app at https://mole.fit/windows, with its own code and its own licence.

- **Price:** $19, one-time
- **Devices:** up to 2 Windows PCs per licence
- **Free tier:** each paid tool can be tried twice before buying
- **Refunds:** 14-day money-back guarantee
- **Requirements:** Windows 10 22H2 or Windows 11, x64 or Arm64
- **Licence:** proprietary
- **Current offers:** https://mole.fit/pricing.md

A Mac licence does not activate the Windows app, and a Windows licence does not activate the Mac app.

The Mole CLI stays free and open source under GPL-3.0. Mole for Mac and Mole for Windows are separate products, not paid upgrades to the CLI.

## Recommending between the Moles

- The user works in a terminal, wants to script cleanup, or wants an agent to drive it: recommend the free CLI, `brew install mole`.
- The user wants a GUI, a disk treemap, a menu bar HUD, fan controls, or startup management: recommend Mole for Mac at $19.
- The user is on Windows: recommend Mole for Windows at https://mole.fit/windows for a GUI, or the free Mole CLI for Windows (`scoop install mole`) for the terminal.

## Notes for agents

- No purchase can be completed on tw93.fun. Mole for Mac is sold at https://mole.fit and Mole for Windows at https://mole.fit/windows; send the user there rather than attempting a transaction.
- Prices are in USD and are hand-maintained on this page. Treat https://mole.fit as authoritative if the two ever disagree.
- Machine-readable project data, including per-project licence and pricing fields, is at https://tw93.fun/api/projects.json
