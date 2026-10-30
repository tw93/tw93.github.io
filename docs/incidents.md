# Incidents

## 2026-10-30: Notes and first-search loading

Invalid notes filters crashed the control sizing code, and failed monthly requests advanced the cursor and disabled loading. First-use search stayed at Loading after its data arrived. The missing layer was browser state-transition testing. `npm test` now covers invalid filters, network/HTTP/invalid-page failures, recovery links and delayed search responses.

## 2026-10-30: Missing post illustration

Both language copies of the generators article referenced a missing asset. Restored the original illustration under `/images/generators-and-channels.png`. The image metadata check should have caught the missing source before publication; `python3 scripts/image_sizes.py --check` verifies it with the other post images.
