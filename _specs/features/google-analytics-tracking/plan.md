# Plan: Google Analytics Tracking

## Existing components to reuse

- `src/app/router.tsx`'s `RouterProvider` — already centralises every
  path change (initial state, `navigate()`, `popstate`). This is the
  single hook point for page-view calls; no new routing logic needed.
- `src/features/videos/videos.service.ts`'s pattern for optional
  `VITE_`-prefixed config, read via `import.meta.env`, with graceful
  failure when unset — reused as the model for the analytics service's
  missing-config behaviour (no-op instead of throw, since this isn't
  user-facing content).
- `tests/unit/setup.ts` / existing Vitest conventions (`vi.stubEnv`,
  `vi.unstubAllEnvs`, `vi.stubGlobal`) from `videos.service.test.ts`.

## Files expected to change

- `src/main.tsx` — call `initAnalytics()` once at startup.
- `src/app/router.tsx` — call `trackPageView(path)` inside
  `RouterProvider` whenever `path` changes (initial mount + every
  update), covering `navigate()` and `popstate` alike since both flow
  through the same `path` state.

## New files

- `src/services/analytics.service.ts` — `initAnalytics()`,
  `trackPageView(path: string)`.
- `src/services/analytics.service.test.ts`
- `src/app/router.test.tsx` — first test file for the router; covers
  initial-path tracking, `navigate()` tracking, and `popstate` tracking.
- `.env.example` (repo root) — documents `VITE_GA_MEASUREMENT_ID` (this
  file doesn't currently exist; it was removed 2026-07-24 per
  `_specs/architecture.md` §35, and this feature reintroduces it for
  this one variable, per the spec's Supportability requirement).

## Data or API changes

None. `VITE_GA_MEASUREMENT_ID` is read from `import.meta.env`, mirroring
the existing `VITE_YOUTUBE_*` variables. No new npm dependency — the
GA4 `gtag.js` script is injected via a plain `<script>` tag, per the
spec's Constraints.

## Tests to add or update

- `src/services/analytics.service.test.ts`:
  - no-ops (no script tag, no `gtag` calls) when
    `VITE_GA_MEASUREMENT_ID` is unset/empty
  - injects exactly one `gtag.js` script tag when a valid ID is present,
    even across repeated `initAnalytics()` calls (duplicate guard)
  - `trackPageView` calls `gtag('event', 'page_view', ...)` with the
    given path once initialised
  - `trackPageView` is a safe no-op when never initialised
- `src/app/router.test.tsx` (new):
  - mounting `RouterProvider` tracks the initial path
  - `navigate()` tracks the new path
  - a `popstate` event tracks the resulting path
  - uses a mocked `../services/analytics.service` module — no real
    `gtag.js`/network involved
- Full existing suite must continue passing unchanged.

## Dependencies

None new. Uses `import.meta.env`, `document`, `window` — all already
available in this Vite/Preact/TS stack.

## Risks

- **Duplicate script injection** in dev (HMR) or if `initAnalytics()` is
  accidentally called twice — mitigated with a module-level guard flag.
- **Test environment has no real `gtag.js`** — tests must mock/spy on
  the service rather than hitting the network; `analytics.service.test.ts`
  asserts against the injected `<script>` tag and a stubbed
  `window.gtag`/`dataLayer`, never a real Google endpoint.
- **`router.tsx` currently has no test file** — this plan adds the
  first one; kept narrowly scoped to path-tracking behaviour already
  present, not a full router rewrite/test of unrelated behaviour.

## Acceptance criteria mapping

- FR-001, FR-002, FR-006, FR-007 → `analytics.service.test.ts` config /
  no-op / async-load cases.
- FR-003, FR-004, FR-008 → `router.test.tsx` initial-path, `navigate()`,
  `popstate`, and (implicitly, since `NotFoundPage` is reached via a
  normal path that just doesn't match a route) 404 cases — no special
  casing needed in the router for 404 since it's just an unmatched path
  going through the same `path` state.
- FR-005 → enforced by construction: only `analytics.service.ts` touches
  `gtag`/`window.dataLayer`; `router.tsx` only calls the exported
  `trackPageView`.
- Privacy / Security / Performance NFRs → no PII passed to `gtag`, ID is
  public by design, script tag uses `async`.
