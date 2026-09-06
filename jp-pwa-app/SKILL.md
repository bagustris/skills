---
name: jp-pwa-app
description: Scaffold or bring into line a static, buildless Japanese-learning PWA under /home/bagus/github/ (the kanji-drill / kotoba / jlpt / kaiwa family) — the three-bar hamburger settings dialog, shared CSS design tokens, manifest.json/sw.js, Keep-a-Changelog CHANGELOG.md, namespaced localStorage keys, and per-app CLAUDE.md. Use this whenever the user wants to start a new app in that family ("make a new app like kanji-drill", "start a jp quiz app for particles"), or wants an existing app brought up to the same conventions ("add the three-bar config to this", "make this consistent with my other apps", "why doesn't this have a settings menu / CHANGELOG"), even if they don't name this skill directly.
---

# jp-pwa-app: scaffold & conventions for the Japanese-learning PWA family

## Why this exists

Bagus maintains several near-identical Japanese-learning PWAs
(`kanji-drill`, `kotoba`, `jlpt`, `kaiwa`, and more to come) under
`/home/bagus/github/`. They share one design: plain HTML/CSS/JS, no build
step, a hamburger-icon settings dialog, a Keep-a-Changelog `CHANGELOG.md`
that's the single source of truth for the version shown in-app, and a
stale-while-revalidate service worker. Without this skill, each new app
reinvents (or subtly diverges from) that shape. `kanji-drill` and `kotoba`
are the canonical reference implementations — read their source when this
file doesn't cover something.

The condensed version of these conventions also lives in
`/home/bagus/github/CLAUDE.md` (auto-loaded whenever Claude works inside
that directory tree). This skill is where the *scaffolding* lives — invoke
it to actually generate or patch files, not just to recall the rules.

## Two situations this skill handles

### 1. Starting a brand-new app

Ask the user (if not already given) for:
- `app-name`: lowercase-hyphenated id, e.g. `particle-drill` — used in
  storage keys and the service-worker cache version.
- `title-ja` / `title-en`: e.g. `助詞ドリル` / `Particle Drill`.
- an accent color (`--accent`), a darker shade for hover/active
  (`--accent-dark`), and a dark-mode accent-ink tuned for ~5.5:1 contrast on
  a dark background (`--accent-ink-dark`) — pick something visually
  distinct from the other apps' colors (kanji-drill is red/`#c0392b`,
  kotoba is green-ish/`#1a2e28`-family; check the other apps' `style.css`
  `:root` blocks to avoid collisions).
- an `icon-glyph`: one kanji/character for the generated `icon.svg`.

Then run the bundled scaffold script rather than hand-copying files — it
does the placeholder substitution deterministically and reports if
anything was missed:

```bash
python3 /home/bagus/.claude/skills/jp-pwa-app/scripts/scaffold.py \
  --target /home/bagus/github/<app-name> \
  --app-name <app-name> \
  --title-ja "<APP_TITLE_JA>" --title-en "<App Title En>" \
  --accent "#rrggbb" --accent-dark "#rrggbb" --accent-ink-dark "#rrggbb" \
  --icon-glyph <一字>
```

After scaffolding, the target directory has `index.html`, `style.css`,
`manifest.json`, `sw.js`, `icon.svg`, `CHANGELOG.md`, `CLAUDE.md`, and
`js/{settings.js,app.js}` — all boilerplate, no app-specific content yet.
From there:

1. Build the actual quiz/content screens inside `<div id="app">` in
   `index.html`, plus whatever `js/` modules the app's logic needs — add
   each new script's `<script src="...">` tag **before** `js/app.js` (script
   order is dependency order; there's no bundler) and add its path to
   `CORE_ASSETS` in `sw.js` in the same change, or the file 404s silently
   for installed/offline users.
2. Add each user-facing setting as a `.settings-row` inside
   `#settings-panel` (boolean → `.switch`, grouped choice →
   `.settings-row-column` + `.settings-segmented`), and wire it up in
   `initSettingsPanel()` in `js/app.js` — copy the pattern for an existing
   setting from `kanji-drill/js/app.js` rather than inventing a new one.
3. Fill in `SettingsManager`'s `DEFAULTS` in `js/settings.js` for whatever
   preferences the app needs.
4. Write the app's real first `CHANGELOG.md` entry (replace the `0.1.0`
   placeholder), a full `README.md`, and flesh out the per-app `CLAUDE.md`
   (architecture, data shape, gotchas) at the level of detail in
   `kanji-drill/CLAUDE.md` — this skill's template only stubs it.
5. Set up GitHub Pages deploy the way existing apps do: a plain
   branch-deploy, unless the app vendors data via a git submodule, in which
   case it needs the explicit-checkout Actions workflow like
   `kanji-drill/.github/workflows/deploy-pages.yml` (classic branch-deploy
   does not check out submodules).

### 2. Bringing an existing app into line

When asked to add the three-bar config, a CHANGELOG, or "make this
consistent" to an app that already exists (e.g. `onchou`, which currently
has neither):

1. Diff what's missing against the checklist in "Required files, every
   app" below — don't assume everything's missing just because one piece
   is.
2. Copy only the missing pieces from `assets/template/` (or straight from
   `kanji-drill`/`kotoba`), by hand — the scaffold script targets a fresh
   directory and will refuse to run against one that already exists.
3. Preserve the app's existing accent color/theme rather than overwriting
   it; only the *shape* (markup structure, CSS class names, CHANGELOG
   format, storage-key convention) needs to match, not the specific colors
   or content.
4. Wire the new settings dialog into whatever the app's existing
   header/JS looks like — read its current `index.html`/`app.js` first, the
   integration point will differ from a fresh scaffold.

## Required files, every app

- `index.html`, `style.css`, `manifest.json`, `sw.js`, `icon.svg`
- `CHANGELOG.md` (Keep a Changelog + semver; see template header)
- `README.md` (feature documentation, kept up to date)
- `CLAUDE.md` (per-app architecture/gotchas; family-wide rules are in the
  parent `github/CLAUDE.md`, not repeated per app)

## The three-bar settings dialog

Hamburger button in the header opens a `.settings-overlay` containing a
`.settings-panel` dialog. See `assets/template/index.html` for the exact
markup (header, overlay, panel, install-row, about-row) — copy it verbatim
and only add/remove `.settings-row`s; don't invent a different settings UI
(a separate page, a `<select>` menu, a different icon) for a new app.

## CSS

`assets/template/style.css` carries the full shared block: `:root` design
tokens (`--bg`, `--fg`, `--accent`, `--accent-dark`, `--accent-ink`,
`--muted`, `--card-bg`, `--border`, `--radius`, ...), a
`prefers-color-scheme: dark` override, and the `.app-header` / `.icon-btn`
/ `.hamburger-icon` / `.settings-overlay` / `.settings-panel` /
`.settings-row` / `.switch` / `.segmented-btn` rules. Only `--accent` /
`--accent-dark` / `--accent-ink-dark` (and the matching `theme-color`
meta / `manifest.json` colors) should differ per app.

## Storage keys

`localStorage` keys are namespaced `<app-name>-settings` (preferences) and
`<app-name>-progress` (learning history, if the app tracks it) — separate
keys so resetting one never wipes the other. Both are versioned,
defensively-parsed JSON: a missing key or bad JSON falls back to in-code
`DEFAULTS`, never throws. See `js/settings.js` in the template or any
existing app.

## Service worker (`sw.js`)

Stale-while-revalidate: serve from cache instantly, refresh in the
background. `CACHE_VERSION` is `'<app-name>-vN'` — **bump N whenever any
cached file changes**, or installed/offline clients keep serving stale
content. `CORE_ASSETS` is an explicit file list (not a glob) that must
mirror every `<script>`/`<link>` in `index.html`.

## CHANGELOG.md

Keep a Changelog + Semantic Versioning, with the header from
`assets/template/CHANGELOG.md` copied verbatim. `loadAppVersion()` in
`js/app.js` fetches `CHANGELOG.md` at runtime and regexes the newest
`## [x.y.z]` heading for the About panel — never hand-duplicate the version
elsewhere. Every user-visible change gets a new CHANGELOG entry *and* a
bumped `sw.js` `CACHE_VERSION` in the same change.

## PWA install prompt

`beforeinstallprompt` / `appinstalled` wiring (deferred prompt captured,
install button shown once available) is boilerplate — it's already in
`assets/template/js/app.js`; don't re-derive it.
