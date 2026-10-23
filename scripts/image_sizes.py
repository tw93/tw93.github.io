#!/usr/bin/env python3
"""Record the pixel size of every image the posts show.

The build reads _data/image_sizes.json and writes width and height onto each
<img> (see _plugins/cdn_image_filter.rb), so the browser reserves the image's
space before it downloads instead of jumping from zero height. The build never
fetches images itself: Vercel would pay for hundreds of downloads per deploy and
a slow host would stall it.

Run after adding images to a post; only images missing from the file are
fetched. --check exits 1 when a post image has no recorded size.
"""

from __future__ import annotations

import io
import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "_data" / "image_sizes.json"
SOURCES = ["_posts", "_posts_en"]
MARKDOWN_IMG = re.compile(r"!\[[^\]]*\]\(\s*<?([^)\s>]+)")
HTML_IMG = re.compile(r"<img\b[^>]*?\bsrc=[\"']([^\"']+)[\"']", re.I)
SVG_ROOT = re.compile(rb"<svg\b[^>]*>", re.S)
SVG_VIEWBOX = re.compile(rb"viewBox=[\"']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)")
SVG_WIDTH = re.compile(rb"\swidth=[\"']([\d.]+)(?:px)?[\"']")
SVG_HEIGHT = re.compile(rb"\sheight=[\"']([\d.]+)(?:px)?[\"']")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15"


def post_images() -> set[str]:
    urls: set[str] = set()
    for folder in SOURCES:
        for path in (ROOT / folder).glob("*.md"):
            text = path.read_text(encoding="utf-8")
            urls.update(MARKDOWN_IMG.findall(text))
            urls.update(HTML_IMG.findall(text))
    return {u.replace("&amp;", "&") for u in urls if u.startswith(("http", "/"))}


def read_bytes(url: str) -> bytes:
    if url.startswith("//"):
        url = "https:" + url
    elif url.startswith("/"):
        return (ROOT / url.split("?")[0].lstrip("/")).read_bytes()
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def measure(url: str) -> tuple[str, list[int] | None]:
    try:
        data = read_bytes(url)
        head = data[:4096]
        # Raster files can carry SVG text in their metadata (a PNG iTXt chunk
        # read as a 716x716 viewBox), so only text that starts with "<" is SVG.
        if head.lstrip(b"\xef\xbb\xbf \t\r\n").startswith(b"<"):
            root = SVG_ROOT.search(data)
            if not root:
                return url, None
            width, height = SVG_WIDTH.search(root.group(0)), SVG_HEIGHT.search(root.group(0))
            if width and height:
                return url, [round(float(width.group(1))), round(float(height.group(1)))]
            box = SVG_VIEWBOX.search(root.group(0))
            if not box:
                return url, None
            # No pixel size: the SVG fills its column like width="100%", so the
            # third value tells the build to keep it fluid.
            return url, [round(float(box.group(1))), round(float(box.group(2))), 1]
        with Image.open(io.BytesIO(data)) as image:
            return url, list(image.size)
    except Exception as error:  # noqa: BLE001 - report and move on
        print(f"skip {url}: {error}", file=sys.stderr)
        return url, None


def main() -> int:
    sizes: dict[str, list[int]] = json.loads(OUT.read_text()) if OUT.exists() else {}
    wanted = post_images()
    missing = sorted(u for u in wanted if u not in sizes)

    if "--check" in sys.argv:
        for url in missing:
            print(f"no size: {url}")
        print(f"image sizes: {len(wanted) - len(missing)}/{len(wanted)} recorded")
        return 1 if missing else 0

    with ThreadPoolExecutor(max_workers=16) as pool:
        for url, size in pool.map(measure, missing):
            if size and size[0] > 0 and size[1] > 0:
                sizes[url] = size
    sizes = {url: size for url, size in sizes.items() if url in wanted}
    OUT.parent.mkdir(exist_ok=True)
    lines = [f"{json.dumps(url, ensure_ascii=False)}: {json.dumps(size)}" for url, size in sorted(sizes.items())]
    OUT.write_text("{\n" + ",\n".join(lines) + "\n}\n")
    failed = [u for u in missing if u not in sizes]
    print(f"measured {len(missing) - len(failed)}, failed {len(failed)}, total {len(sizes)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
