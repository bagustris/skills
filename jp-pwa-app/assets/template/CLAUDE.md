# CLAUDE.md

This file provides guidance to Claude Code when working with code in this
repository. Family-wide conventions (three-bar settings dialog, CSS design
tokens, storage-key naming, CHANGELOG/service-worker rules) live in the
parent `github/CLAUDE.md` — this file documents only what's specific to
**{{APP_TITLE_EN}}**.

## What this is

{{APP_TITLE_JA}} ({{APP_TITLE_EN}}) — <one paragraph: what it quizzes/teaches,
data scope, any notable design decision>.

## Commands

```bash
# Serve locally (required if data is loaded via fetch(), which file:// blocks)
python3 -m http.server 8000
# then open http://localhost:8000
```

## Architecture

```
index.html       Markup + script load order
js/settings.js   SettingsManager — user prefs (localStorage: {{APP_NAME}}-settings)
js/app.js        Screen navigation, quiz flow, DOM wiring
sw.js            Service worker; CORE_ASSETS must mirror index.html's script list
```

<!-- Add app-specific modules, data shape, and gotchas below, at the level
     of detail in kanji-drill/CLAUDE.md. -->
