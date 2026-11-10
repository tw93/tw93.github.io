---
paths:
  - "scripts/image_sizes.py"
  - "_data/image_sizes.json"
  - "_plugins/**"
---

- Images get their size recorded automatically: `npm run dev` and `npm run build` run `python3 scripts/image_sizes.py` first, which measures only images not yet recorded (old posts' `{{ site.assetUrl }}` is expanded, and tw93.fun's own `/images/` are read from disk). Commit `_data/image_sizes.json` with the post. A post pushed without that step still builds; Jekyll warns "Image sizes: N image(s) have no recorded size" with the URLs, Vercel's log included. The script records each image's pixel size in `_data/image_sizes.json`, and `cdn_image_filter` writes them as `width`/`height` so the browser reserves the box before the image loads (224 of 232 sampled images used to sit at zero height until they arrived). Jekyll rendering never fetches images; an unrecorded image renders without the placeholder if the metadata pre-step was skipped. SVGs with only a viewBox are stored with a third value and get `style="width: 100%"` to keep filling the column. `--check` lists unrecorded images. Detect SVG by content, not by searching for `<svg`: a PNG's metadata can hold SVG text, which once recorded 50 images as 716x716.
