# CLAUDE.md — github/ (project family)

This file applies to every project under `/home/bagus/github/`. Most of
these are static, buildless Japanese-learning PWAs (`kanji-drill`, `kotoba`,
`jlpt`, `kaiwa`, `onchou`, ...) sharing one design: plain HTML/CSS/JS, no
build step, a hamburger-icon settings dialog, a Keep-a-Changelog
`CHANGELOG.md` that's the single source of truth for the in-app version, and
a stale-while-revalidate service worker. `kanji-drill` and `kotoba` are the
canonical reference implementations.

**Use the `jp-pwa-app` skill** (`~/.claude/skills/jp-pwa-app/`) whenever
starting a new app in this family, or bringing an existing one in line with
these conventions (adding the settings dialog, a CHANGELOG, matching CSS,
etc.) — it has the full conventions writeup and a scaffold script that
generates a new app's boilerplate deterministically. Don't re-derive these
conventions from scratch or ask the user to re-explain them; read that
skill first.
