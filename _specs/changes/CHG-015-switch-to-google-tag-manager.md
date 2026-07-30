# CHG-015 — Switch Google Analytics loading to Google Tag Manager

## Status

Implemented (2026-07-30)

## Requested change

Replace the site's direct `gtag.js` Google Analytics integration with
Google Tag Manager (container `GTM-54ZWZN4W`): install the standard GTM
snippet (the loader `<script>` as high as possible in `index.html`'s
`<head>`, plus the `<noscript><iframe>` fallback immediately after the
opening `<body>` tag), and retire the current
`VITE_GA_MEASUREMENT_ID`-driven `gtag.js` script-injection code, since GA4
will now be configured as a tag inside the GTM container itself rather
than hard-wired into this codebase.

## Reason

The site owner reports Google Analytics has never detected the tag.
Investigation (live-browser trace against `davesfunrc.com`) confirmed the
existing direct integration is technically working exactly as coded — the
`gtag.js` script loads, `window.dataLayer` is processed, a `page_view`
event is queued — but the site owner's actual verification method is
Google Tag Manager, and the current implementation never installs a GTM
container at all. The site owner wants Tag Manager on the site instead of
(not alongside) the direct integration, so tag configuration (GA4, and
any future tags) lives in the GTM web UI rather than in this repository.

## Current behaviour

- `index.html` has no analytics-related markup — only the GA-unrelated
  404-redirect decode `<script>`.
- `src/main.tsx` calls `initAnalytics()` once at startup.
- `src/services/analytics.service.ts`'s `initAnalytics()` reads
  `import.meta.env.VITE_GA_MEASUREMENT_ID`; if set, it creates a
  `<script id="ga4-gtag-script" src="https://www.googletagmanager.com/
  gtag/js?id=...">` tag, appends it to `<head>`, initialises
  `window.dataLayer`/`window.gtag`, and calls `gtag('config', id, {
  send_page_view: false })`.
- `trackPageView(path)` calls `window.gtag('event', 'page_view', {
  page_path: path })`; it's a no-op if `gtag` was never initialised.
- `src/app/router.tsx`'s `RouterProvider` calls `trackPageView(path)` in a
  `useEffect` on its `path` state, covering initial load, `navigate()`,
  and `popstate` (including 404s).
- `VITE_GA_MEASUREMENT_ID` is a GitHub Actions repo secret, forwarded to
  the build step in `.github/workflows/deploy-pages.yml` (per
  [CHG-009](CHG-009-ga-measurement-id-deploy-workflow.md)), and documented
  in the root `.env.example`.

## Desired behaviour

- `index.html` gets the two standard GTM install pieces:
  - The loader `<script>` (the async IIFE that pushes `gtm.start`/
    `gtm.js` and injects `gtm.js`) placed immediately after the
    `<meta charset>` line — as high in `<head>` as possible while still
    keeping the charset declaration first, per the HTML spec requirement
    that charset be within the document's first 1024 bytes.
  - The `<noscript><iframe src="https://www.googletagmanager.com/
    ns.html?id=...">` fallback placed immediately after the opening
    `<body>` tag, before `<div id="app">`.
  - The container id is **not** hard-coded: it's written as
    `%VITE_GTM_CONTAINER_ID%` in both places, using Vite's built-in HTML
    env-replacement (`%ENV_NAME%` syntax, resolved from
    `import.meta.env` at build time) — consistent with this project's
    existing rule (architecture §20, and the current GA feature's FR-002)
    that externally-facing IDs are configured via a `VITE_`-prefixed
    variable, not hard-coded in source, even though — like the GA
    Measurement ID — a GTM container id isn't a secret.
- `src/services/analytics.service.ts` is reduced to just the page-view
  tracking call — no more script injection, since GTM's own snippet now
  owns loading and owns creating `window.dataLayer`:
  - `initAnalytics()` and its script-injection logic, the
    `SCRIPT_ID`/`ga4-gtag-script` guard, and the `window.gtag` stub are
    all removed.
  - `trackPageView(path)` becomes a small guarded push onto the GTM-
    managed data layer: `window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'page_view', page_path: path });`.
    This is the standard "virtual pageview" pattern for GTM on a
    client-side-routed SPA — GTM's base snippet only fires its own
    `gtm.js` load event once on initial page load, so subsequent in-app
    route changes still need an explicit `dataLayer` push for any GTM
    tag/trigger to see them. The event name/shape (`event: 'page_view'`,
    `page_path`) is unchanged from what the direct integration already
    sent, so the site owner can wire a GTM Custom Event trigger named
    `page_view` reading a `page_path` Data Layer Variable.
- `src/main.tsx` no longer calls `initAnalytics()` — nothing left to
  initialise from JavaScript; the import and the call are removed.
- `VITE_GA_MEASUREMENT_ID` is retired from the codebase (`.env.example`,
  the deploy workflow's `env:` block) and replaced by
  `VITE_GTM_CONTAINER_ID` (format `GTM-XXXXXXX`) in both places, following
  the exact pattern [CHG-009](CHG-009-ga-measurement-id-deploy-workflow.md)
  established for `VITE_GA_MEASUREMENT_ID` — a new GitHub Actions repo
  secret, forwarded to the `Build` step.
- The `VITE_GA_MEASUREMENT_ID` GitHub Actions repo secret and any local
  `.env` entry for it become unused after this change; removing them is
  the site owner's call (see Out of scope) — this change doesn't require
  it to function correctly, since an unused secret is simply never read.

## Change classification

Existing-feature enhancement

## Affected specification

`_specs/features/google-analytics-tracking/spec.md` — this change
supersedes most of how the feature is implemented while keeping its
purpose (page-view tracking on every route) intact. Sections needing
updates during `implement-change`:
- FR-001/FR-002 — GA4 tag loading is no longer `gtag.js` driven directly
  by this codebase; the GTM container is loaded via static markup in
  `index.html`, configured via `VITE_GTM_CONTAINER_ID`.
- FR-005 — "isolated behind a single service module" still holds, but the
  module's responsibility shrinks to the `dataLayer` push only; GTM's own
  loader script is markup, not something a service module can (or should)
  own.
- Interfaces — `analytics.service.ts`'s responsibilities section rewritten
  to match the new, smaller `trackPageView`-only implementation; `index.
  html` added as a new interface location.
- Constraints — the "must comply with architecture §18: external services
  accessed only through a typed service module" note needs a caveat: the
  GTM *loader* is unavoidably static HTML (that's how GTM's own
  `<noscript>` fallback works), while the *page-view event* stays behind
  `analytics.service.ts`.
- Tests — updated to match the new test list below.

## Affected implementation areas

- `index.html` (shared entry file) — add the GTM `<script>` and
  `<noscript>` snippets, both referencing `%VITE_GTM_CONTAINER_ID%`.
- `src/services/analytics.service.ts` — remove `initAnalytics()`/script
  injection; `trackPageView` reimplemented as a `dataLayer.push()`.
- `src/services/analytics.service.test.ts` — rewritten (see Tests).
- `src/main.tsx` — remove the `initAnalytics` import and call.
- `.env.example` — replace the `VITE_GA_MEASUREMENT_ID` entry with
  `VITE_GTM_CONTAINER_ID`.
- `.github/workflows/deploy-pages.yml` — replace
  `VITE_GA_MEASUREMENT_ID: ${{ secrets.VITE_GA_MEASUREMENT_ID }}` with
  `VITE_GTM_CONTAINER_ID: ${{ secrets.VITE_GTM_CONTAINER_ID }}` in the
  `Build` step's `env:` block.
- New file `index.html.test.ts` (or similar, under `tests/` or `src/`,
  wherever the project's non-component tests live) — a plain
  `fs.readFileSync`-based regression test asserting `index.html` contains
  the GTM head script and the noscript body snippet, both referencing
  `%VITE_GTM_CONTAINER_ID%`.
- `src/app/router.tsx` — **not** changed. It already just calls
  `trackPageView(path)` on every path change; that contract doesn't
  change, only what happens inside `trackPageView`.
- No other page/feature component, shared UI component, or route is
  touched.

## Requirements

1. The GTM loader script appears in `index.html`'s `<head>`, immediately
   after the `<meta charset>` line.
2. The GTM `<noscript>` fallback appears immediately after the opening
   `<body>` tag, before `<div id="app">`.
3. Both snippets reference `%VITE_GTM_CONTAINER_ID%`, not a hard-coded
   container id, so a real build with `VITE_GTM_CONTAINER_ID=GTM-54ZWZN4W`
   set produces a `dist/index.html` with that id substituted in both
   places (verified via `npm run build` + inspecting `dist/index.html`,
   the same style of build-output verification used in
   [CHG-008](CHG-008-about-page-images.md)).
4. `analytics.service.ts` no longer creates or appends any `<script>`
   element, and no longer defines `window.gtag`.
5. `trackPageView(path)` pushes `{ event: 'page_view', page_path: path }`
   onto `window.dataLayer`, creating `window.dataLayer` first if it
   doesn't already exist (defensive — GTM's own snippet creates it in
   practice, but the guard keeps this safe if ever called before GTM's
   inline script has run, and keeps local dev/test usable with no GTM
   markup present at all).
6. `main.tsx` no longer imports or calls `initAnalytics`.
7. `VITE_GA_MEASUREMENT_ID` is fully removed from `.env.example` and the
   deploy workflow; `VITE_GTM_CONTAINER_ID` is added to both in its
   place.
8. No new npm dependency — GTM, like the direct integration it replaces,
   is a plain `<script>`/`<noscript>` snippet.
9. Local dev and CI builds succeed with `VITE_GTM_CONTAINER_ID` unset
   (Vite's HTML replacement leaves `%VITE_GTM_CONTAINER_ID%` as literal
   text in that case — acceptable, since an unset/placeholder id in a
   local dev build has no functional consequence and matches this
   project's existing "must work with missing `VITE_*` config" precedent
   in spirit, even though — unlike the old `gtag.js` service — there's no
   conditional branch to skip here).

## Acceptance criteria

- Given a production build with `VITE_GTM_CONTAINER_ID=GTM-54ZWZN4W`,
  when `dist/index.html` is inspected, then it contains the GTM loader
  script in `<head>` and the `<noscript>` iframe after `<body>`, both with
  `GTM-54ZWZN4W` substituted in.
- Given a visitor loads any route, when the page finishes loading, then
  `window.dataLayer` contains the GTM bootstrap entry (`gtm.start`/
  `gtm.js`) followed by a `{ event: 'page_view', page_path: '<path>' }`
  entry for that route.
- Given a visitor navigates in-app (nav link, footer link, or browser
  back/forward), when the route changes, then a new `{ event: 'page_view',
  page_path: '<new path>' }` entry is pushed to `window.dataLayer` —
  verified via the existing `router.test.tsx` suite continuing to pass
  unmodified (it only asserts `trackPageView` is called with the right
  path, not its internals).
- Given a visitor navigates to a non-existent path, then a `page_view`
  push still occurs for that path (unchanged 404 behaviour).
- Given `analytics.service.test.ts`'s new assertions, when
  `trackPageView` is called before anything else has touched
  `window.dataLayer`, then it initialises `dataLayer` itself rather than
  throwing.
- `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
  build` all pass.

## Regression risks

- **Tracking gap during cutover, and a GTM-side dependency this change
  can't satisfy from code alone**: installing the GTM container snippet
  only gets Tag Manager itself running — it does **not** automatically
  recreate the GA4 tracking the direct integration provided. For GA4 data
  to keep flowing, the site owner needs to add a GA4 Configuration tag
  (or GA4 Event tag) inside the GTM container's own web UI, triggered by
  a Custom Event trigger matching the `page_view` event this change
  starts pushing to `dataLayer` (see Out of scope) — otherwise the site
  goes from "tag not detected" to "tag detected, but still no GA4 data,"
  which would look like a partial fix rather than a real one. This is
  flagged prominently rather than assumed away, per this Skill's
  instruction not to invent missing business rules.
- **Duplicate tracking risk if the old secret/config lingers**: because
  `VITE_GA_MEASUREMENT_ID` is only removed from this codebase (not
  necessarily from the site owner's GA4 account), there's no double-
  counting risk from this change itself — the direct `gtag.js` script
  is fully removed, so only whatever the site owner configures inside
  GTM will send data.
- **Low code risk otherwise**: no shared UI component, route, or page
  content is touched; `router.tsx`'s contract with `analytics.service.ts`
  (`trackPageView(path)`) is unchanged, so `router.test.tsx` needs no
  changes and continues to guard the tracking-call-per-navigation
  behaviour.
- **`index.html` is a shared, application-wide file** (per architecture
  §6/§7, outside any single feature's ownership) — the edit here is
  narrowly scoped to two new, self-contained snippets and doesn't touch
  the existing 404-redirect script, font preconnects, or `<div id="app">`
  mount point.

## Out of scope

- Configuring any tag or trigger **inside** Google Tag Manager's own web
  UI (e.g. the GA4 Configuration tag, the `page_view` Custom Event
  trigger, or any future tags) — that happens in Tag Manager, outside
  this repository, and is the site owner's responsibility to complete
  after this change ships. This spec only guarantees the container loads
  and that a `page_view` event with a `page_path` reaches `dataLayer` for
  GTM to act on.
- Deleting the now-unused `VITE_GA_MEASUREMENT_ID` GitHub Actions secret
  or the site owner's GA4 property/Measurement ID itself — those may
  still be reused as the Measurement ID referenced by a GA4 tag
  configured inside GTM.
- Any cookie-consent/consent-mode UI — unchanged from the existing
  feature spec's Out of scope; still flagged as an open question there,
  not addressed by this change.
- Custom/business event tracking beyond page views (outbound link clicks,
  form submissions) — unchanged scope boundary from the original feature.
- Running GTM and the direct `gtag.js` integration side by side — the
  site owner explicitly chose "switch to GTM," not "run both."

## Documentation updates

- `_specs/features/google-analytics-tracking/spec.md` — updated per
  Affected specification above, as part of `implement-change`'s
  Definition of done.
- `_specs/feature-index.md` — the "Google Analytics Tracking" row/summary
  updated to describe the GTM-based implementation and the new
  `VITE_GTM_CONTAINER_ID` dependency, replacing the `VITE_GA_
  MEASUREMENT_ID` one.
- `_specs/change-index.md` — new row for this change.
