#!/usr/bin/env python3
"""Check that each post describes itself.

Titles and descriptions may be short. This script does not enforce a character
count. It fails when a post has no summary, reuses the site boilerplate, or
writes the summary in the other language.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ZH_DIR = ROOT / "_posts"
EN_DIR = ROOT / "_posts_en"
CJK = re.compile(r"[\u4e00-\u9fff]")
FRONT_MATTER = re.compile(r"^---\n(.*?)\n---", re.S)


def site_description() -> str:
    config = (ROOT / "_config.yml").read_text(encoding="utf-8")
    match = re.search(r'^description:\s*"(.*)"\s*$', config, re.M)
    if not match:
        raise SystemExit("could not read site description from _config.yml")
    return match.group(1)


def front_matter_value(text: str, key: str) -> str | None:
    match = FRONT_MATTER.match(text)
    if not match:
        return None
    for line in match.group(1).splitlines():
        if line.startswith(f"{key}:"):
            value = line.split(":", 1)[1].strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            return value
    return None


def check_language(path: Path, summary: str, lang: str) -> str | None:
    cjk = len(CJK.findall(summary))
    letters = len(re.findall(r"[A-Za-z]", summary))
    if lang == "zh":
        if cjk < 4:
            return f"{path.name} Chinese summary has too little Chinese text"
        return None
    if letters < 8 or (cjk / len(summary) > 0.35):
        return f"{path.name} English summary is not English"
    return None


def main() -> int:
    boilerplate = site_description()
    errors: list[str] = []
    counts = {"zh": 0, "en": 0}
    post_files = list(ZH_DIR.glob("*.md")) + list(EN_DIR.glob("*.md"))
    static_files = [ROOT / "about.md", ROOT / "en" / "about.md", ROOT / "privacy.md"]
    privacy_en = ROOT / "en" / "privacy.md"
    if privacy_en.exists():
        static_files.append(privacy_en)

    for path in post_files:
        lang = "en" if EN_DIR in path.parents else "zh"
        text = path.read_text(encoding="utf-8")
        title = front_matter_value(text, "title")
        summary = front_matter_value(text, "summary")
        counts[lang] += 1
        if not title:
            errors.append(f"{path.name} has no title")
        if not summary:
            errors.append(f"{path.name} has no summary")
            continue
        if summary == boilerplate:
            errors.append(f"{path.name} summary is the site boilerplate")
        message = check_language(path, summary, lang)
        if message:
            errors.append(message)

    for path in static_files:
        if not path.exists():
            errors.append(f"missing {path.relative_to(ROOT)}")
            continue
        lang = "en" if path.parts[-2] == "en" else "zh"
        text = path.read_text(encoding="utf-8")
        summary = front_matter_value(text, "summary")
        title = front_matter_value(text, "title")
        if not title:
            errors.append(f"{path.relative_to(ROOT)} has no title")
        if not summary:
            errors.append(f"{path.relative_to(ROOT)} has no summary")
            continue
        message = check_language(path, summary, lang)
        if message:
            errors.append(message)

    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"seo copy: ok ({counts['zh']} Chinese posts, {counts['en']} English posts)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
