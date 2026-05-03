# SiteLens

> A local-first, offline-first pre-deployment website checker for developers.

SiteLens analyzes HTML for **accessibility**, **structural**, **UX**, **CSS**, and **visual** issues — entirely in your browser. No accounts, no backend, no telemetry. Optional AI insights are available as an opt-in upgrade layer, never forced.

---

## ✨ Features

- 🔒 **Local-first** — All scans run in-browser via the DOM parser. Nothing is uploaded.
- ⚡ **Instant feedback** — Rule-based engine returns results in milliseconds.
- 🧪 **Three input modes** — URL, drag-and-drop HTML file, or pasted source.
- 📊 **Scored reports** — 0–100 score with severity-weighted penalties.
- 🗂 **Grouped issues** — Accessibility, UX, CSS, and Visual categories.
- 💾 **Save & revisit** — Recent (session) and Saved (persistent, 10 max) scans.
- 🛑 **Cancellable scans** — Stop and return to input state at any time.
- ⏱ **Status summary** — Scan duration and severity breakdown above results.
- ✨ **Optional AI insight** — Per-issue, opt-in. Never auto-runs.
- 🌑 **Dark, minimal, dev-tool aesthetic** — No clutter, no flashy animations.

---

## 🧱 What it checks

| Category       | Examples                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| Accessibility  | Missing `alt`, unlabeled form controls, no `lang`, no `<main>` landmark  |
| UX             | Missing `<title>`, viewport, meta description, multiple/missing `<h1>`   |
| CSS            | Inline-style overuse, div soup                                           |
| Visual         | Tap targets with sub-12px text                                           |

Each issue includes a **short summary**, **detailed explanation**, and a **suggested fix**.

---

## 🚀 Getting started

```bash
bun install
bun dev
```

Open the preview, then:

1. Paste a URL, drop an `.html` file, or paste raw HTML.
2. Click **Scan**.
3. Review issues grouped by category. Save the report if useful.

---

## 🧠 Philosophy

- **Developer-first.** Built like a CLI given a UI — terse, fast, dense.
- **No forced AI.** The scanner is deterministic and local. AI is a side-door.
- **No auto-fixes.** We surface problems; you decide how to fix them.
- **No clutter.** No upsells, no dashboards, no analytics panels.

A future CLI will mirror the in-browser engine for CI use.

---

## 🧩 Tech stack

- **TanStack Start** + **React 19** + **Vite 7**
- **Tailwind CSS v4** with semantic OKLCH design tokens
- **shadcn/ui** primitives
- **Sonner** for toasts
- **localStorage** for saved scans (no backend)

---

## 📁 Project structure

```
src/
├─ components/sitelens/   # AppHeader, ScanForm, ResultsView, IssueCard, ScanSidebar
├─ lib/sitelens/
│  ├─ scanner.ts          # Local rule-based DOM analyzer
│  ├─ ai.ts               # Optional AI insight layer
│  └─ types.ts            # ScanResult, Issue, IssueCategory
├─ hooks/use-scans.ts     # Recent + Saved scan state (localStorage)
└─ routes/                # TanStack file-based routing
```

---

## 🛣 Roadmap

- [ ] CLI runner (`sitelens scan ./dist`) with JSON / JUnit output
- [ ] CI mode with score thresholds
- [ ] Custom rule packs
- [ ] Diff between two scans
- [ ] Export report as Markdown / PDF

---

## 📄 License

MIT
