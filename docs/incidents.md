# Incidents

## 2026-10-30: Notes and first-search loading

Invalid notes filters crashed the control sizing code, and failed monthly requests advanced the cursor and disabled loading. First-use search stayed at Loading after its data arrived. The missing layer was browser state-transition testing. `npm test` now covers invalid filters, network/HTTP/invalid-page failures, recovery links and delayed search responses.

## 2026-10-30: Missing post illustration

Both language copies of the generators article referenced a missing asset. Restored the original illustration under `/images/generators-and-channels.png`. The image metadata check should have caught the missing source before publication; `python3 scripts/image_sizes.py --check` verifies it with the other post images.

## 2026-10-30: Filtered notes flashed the newest entries on refresh

Static list HTML always contained the newest entries; URL filters took effect only after the deferred script fetched the index and month data. The previous tests checked final results but missed the first paint. A pre-list bootstrap now masks valid filtered initial requests and selects their controls before the notes can paint. Successful results release the mask, including empty results; failed index or month requests expose a retry action without showing the wrong list. Default, invalid-filter and no-JavaScript visits retain the static list. `tests/notes-initial.test.cjs` covers bootstrap ordering, filter validation and initial-state completion; browser checks cover delayed responses and recovery in both languages.
