#!/usr/bin/env python3
"""Scaffold a new jp-pwa-app-family app from the bundled template.

Copies every file under assets/template/ into a target directory, replacing
{{PLACEHOLDER}} tokens along the way. Deterministic substitution belongs in
a script rather than freehand editing, so every scaffolded app starts
byte-for-byte consistent with the others.

Usage:
  python3 scaffold.py --target /home/bagus/github/my-new-app \
    --app-name my-new-app \
    --title-ja アプリ名 --title-en "App Name" \
    --accent "#2e5f8a" --accent-dark "#1f4468" --accent-ink-dark "#6fa8dc" \
    --icon-glyph 新 [--date 2026-09-06]
"""
import argparse
import datetime
import pathlib
import shutil
import sys

TEMPLATE_DIR = pathlib.Path(__file__).resolve().parent.parent / "assets" / "template"


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--target", required=True, help="Directory to create (must not exist)")
    p.add_argument("--app-name", required=True, help="Lowercase-hyphen app id, e.g. my-new-app (used in storage keys, cache version)")
    p.add_argument("--title-ja", required=True, help="Japanese title shown in the header")
    p.add_argument("--title-en", required=True, help="English title, e.g. for manifest.json / <title>")
    p.add_argument("--accent", required=True, help="Primary accent color, e.g. #2e5f8a")
    p.add_argument("--accent-dark", required=True, help="Darker accent shade for hover/active states")
    p.add_argument("--accent-ink-dark", required=True, help="Accent-as-text color tuned for the dark theme (~5.5:1 contrast)")
    p.add_argument("--icon-glyph", required=True, help="Single kanji/character shown on icon.svg")
    p.add_argument("--date", default=None, help="ISO date for the CHANGELOG's first entry (default: today)")
    args = p.parse_args()

    target = pathlib.Path(args.target)
    if target.exists():
        sys.exit(f"error: target {target} already exists — refusing to overwrite")
    if not TEMPLATE_DIR.exists():
        sys.exit(f"error: template dir not found at {TEMPLATE_DIR}")

    date = args.date or datetime.date.today().isoformat()

    replacements = {
        "{{APP_NAME}}": args.app_name,
        "{{APP_TITLE_JA}}": args.title_ja,
        "{{APP_TITLE_EN}}": args.title_en,
        "{{ACCENT_COLOR}}": args.accent,
        "{{ACCENT_DARK}}": args.accent_dark,
        "{{ACCENT_INK_DARK}}": args.accent_ink_dark,
        "{{ICON_GLYPH}}": args.icon_glyph,
        "{{DATE}}": date,
    }

    shutil.copytree(TEMPLATE_DIR, target)

    text_suffixes = {".html", ".css", ".js", ".json", ".md", ".svg"}
    for path in target.rglob("*"):
        if path.is_file() and path.suffix in text_suffixes:
            content = path.read_text(encoding="utf-8")
            for token, value in replacements.items():
                content = content.replace(token, value)
            path.write_text(content, encoding="utf-8")

    remaining = []
    for path in target.rglob("*"):
        if path.is_file() and path.suffix in text_suffixes:
            content = path.read_text(encoding="utf-8")
            if "{{" in content:
                remaining.append(str(path))

    print(f"Scaffolded {target}")
    if remaining:
        print("WARNING: unresolved placeholders remain in:")
        for r in remaining:
            print(f"  {r}")
    else:
        print("All placeholders resolved.")


if __name__ == "__main__":
    main()
