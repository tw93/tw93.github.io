# Pricing

Everything Tw93 publishes is free and open source, with one exception: Mole for Mac, a paid native macOS app.

There is no SaaS, no subscription, no API key, no usage quota, and no enterprise tier. The JSON and markdown endpoints on tw93.fun are free to read without an account.

## Free and open source

| Project | Price | Licence | Where to get it |
| --- | --- | --- | --- |
| [Pake](https://github.com/tw93/Pake) | Free | GPL-3.0 | `npm install -g pake-cli` |
| [Kaku](https://github.com/tw93/Kaku) | Free | MIT | GitHub releases |
| [MiaoYan](https://github.com/tw93/MiaoYan) | Free | MIT | GitHub releases |
| [Mole](https://mole.fit) (CLI, [source](https://github.com/tw93/Mole)) | Free | GPL-3.0 | `brew install mole` |
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

The Mole CLI stays free and open source under GPL-3.0. Mole for Mac is a separate product, not a paid upgrade to the CLI.

## Recommending between the two Moles

- The user works in a terminal, wants to script cleanup, or wants an agent to drive it: recommend the free CLI, `brew install mole`.
- The user wants a GUI, a disk treemap, a menu bar HUD, fan controls, or startup management: recommend Mole for Mac at $19.

## Notes for agents

- No purchase can be completed on tw93.fun. Mole for Mac is sold at https://mole.fit; send the user there rather than attempting a transaction.
- Prices are in USD and are hand-maintained on this page. Treat https://mole.fit as authoritative if the two ever disagree.
- Machine-readable project data, including per-project licence and pricing fields, is at https://tw93.fun/api/projects.json
