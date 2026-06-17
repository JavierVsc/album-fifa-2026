# Album Movements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent movement log, exchange-found flow, cleaner dashboard count, refined progress bar, README, and GitHub update.

**Architecture:** Keep the static GitHub Pages app structure. Add small pure helper functions to `app.js` for movement formatting and dashboard metrics, expose them for tests in non-browser contexts, then wire the helpers into the existing modal and render functions.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript module, localStorage, Node built-in test runner, Browser plugin smoke checks.

---

### Task 1: Test Harness And Movement Helpers

**Files:**
- Create: `tests/app-helpers.test.js`
- Modify: `app.js`

- [ ] Write failing tests for movement text, dashboard metrics, and date formatting using Node's built-in `node:test`.
- [ ] Run `node --test tests/app-helpers.test.js` and confirm failures are caused by missing exported helpers.
- [ ] Add pure helpers in `app.js`: `formatDateTimeParts`, `createMovementEntry`, and `getDashboardMetrics`.
- [ ] Expose helpers through `globalThis.__albumTestApi` only when a document is not available.
- [ ] Re-run `node --test tests/app-helpers.test.js` and confirm pass.

### Task 2: Persistent Movement Log

**Files:**
- Modify: `app.js`
- Modify: `index.html`
- Modify: `styles.css`

- [ ] Add `MOVEMENT_LOG_KEY`.
- [ ] Add `loadMovementLog`, `saveMovementLog`, `recordMovement`, and `renderMovementLog`.
- [ ] Add final page section with `id="movementLog"` and empty state container.
- [ ] Record entries for found, found by exchange, duplicate added, duplicate exchanged, and marked missing actions.
- [ ] Ensure latest movements render first and survive reload through localStorage.

### Task 3: Modal Exchange Find And Dashboard Count

**Files:**
- Modify: `app.js`
- Modify: `index.html`

- [ ] Add modal action `foundExchange` for missing stickers.
- [ ] Update action confirmation text.
- [ ] Replace dashboard blocks with "Láminas Encontradas" rendered as `owned/total`.
- [ ] Keep missing count available in filter summaries, not as a top dashboard card.

### Task 4: Progress Bar Visual Polish

**Files:**
- Modify: `styles.css`

- [ ] Remove the permanent `progressFlow` animation.
- [ ] Use a stable gradient, soft inset highlight, and width transition.
- [ ] Keep reduced-motion behavior compatible.
- [ ] Verify desktop and mobile screenshots for a polished, non-distracting bar.

### Task 5: README And Repository Update

**Files:**
- Create: `README.md`

- [ ] Document app purpose, local static usage, GitHub Pages context, localStorage persistence, PDF export dependency, and movement log behavior.
- [ ] Run automated tests.
- [ ] Run browser smoke checks on desktop and mobile.
- [ ] Review git diff.
- [ ] Commit and push to `origin/main`.
