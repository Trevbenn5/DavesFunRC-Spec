# Feature Index

| Feature | Specification | Status | Dependencies |
| --- | --- | --- | --- |
| Latest Videos | [_specs/features/latest-videos/spec.md](features/latest-videos/spec.md) | Implemented | Requires `VITE_YOUTUBE_API_KEY` (HTTP-referrer-restricted) and `VITE_YOUTUBE_UPLOADS_PLAYLIST_ID` in the deployment environment — see `.env.example`. Until the site owner adds real values, the Videos page shows the designed error state (with a link to the YouTube channel) rather than live data; this is expected, not a defect. |
| Google Analytics Tracking | [_specs/features/google-analytics-tracking/spec.md](features/google-analytics-tracking/spec.md) | Implemented | Requires `VITE_GA_MEASUREMENT_ID` in the deployment environment — see `.env.example`. Until set, the site functions normally with analytics disabled (no error, no tracking). |

## Latest Videos — implementation summary

Replaces the Videos page's placeholder content with a "Latest videos"
section that fetches the 3 most recent DavesFunRC YouTube uploads
(newest first) from the YouTube Data API v3 `playlistItems.list`
endpoint, client-side, via a new feature-local service. Loading shows 3
skeleton placeholders; a fetch failure or missing configuration shows a
plain-language error with a link to the YouTube channel; zero results
shows an empty-state message with the same fallback link.

New files: `src/features/videos/videos.types.ts`,
`videos.service.ts`, `useLatestVideos.ts`,
`components/VideoCard.tsx` (+ `.css`), `VideosPage.css`, and `.env.example`
at the repo root documenting the two required `VITE_YOUTUBE_*` values.
`VideosPage.tsx` was rewritten to use these instead of `PlaceholderPage`.

No shared components, routing, or other pages were touched. No new npm
dependency — native `fetch` only. The no-auth YouTube RSS feed
alternative was investigated and rejected (no CORS support for direct
browser fetch); see the spec's Constraints section.

**Tests**: `src/features/videos/videos.service.test.ts` (request
params, response mapping/sorting, thumbnail fallback, error handling),
`useLatestVideos.test.ts` (loading → loaded / error state transitions),
`VideosPage.test.tsx` (loading, loaded/ordering, error, empty states,
accessible link names). All verified passing, alongside the full existing
suite (`npm run lint`, `typecheck`, `test`, `build`). Visually verified
in a real browser (loading, loaded, error, and mobile-responsive states)
via a temporary build with mocked API responses — not committed.

## Google Analytics Tracking — implementation summary

Adds GA4 page-view tracking across every route via a new
`src/services/analytics.service.ts`, the sole module that touches
`gtag`/`window.dataLayer`. `initAnalytics()` is called once from
`src/main.tsx` at startup; it reads `VITE_GA_MEASUREMENT_ID` and, if
set, injects the `gtag.js` script tag (guarded against duplicate
injection via a stable element id, so a dev HMR reload can't double it
up) and configures GA with `send_page_view: false` so the initial view
isn't double-counted. `trackPageView(path)` is called from
`src/app/router.tsx`'s `RouterProvider` in a `useEffect` keyed on its
existing `path` state, so it fires for the initial load, `navigate()`
calls, `popstate` (back/forward), and unmatched (404) paths alike,
without any per-page wiring. When the measurement id is unset, both
functions no-op silently — no script, no error, no tracking — matching
the Latest Videos feature's precedent for optional `VITE_*` config.

New files: `src/services/analytics.service.ts` (+ `.test.ts`),
`src/app/router.test.tsx` (first test file for the router), and a
reintroduced root `.env.example` (removed during the 2026-07-24
scaffold rebuild) documenting all three `VITE_*` variables used by the
site so far. Modified: `src/main.tsx` (one `initAnalytics()` call),
`src/app/router.tsx` (one `useEffect` calling `trackPageView`). No
shared layout, page components, or routes were touched, and no new npm
dependency — the standard `gtag.js` snippet is loaded via a plain
`<script>` tag.

**Tests**: `src/services/analytics.service.test.ts` (no-op when
unconfigured, single script injection across repeated init calls, GA
config call shape, `trackPageView` event shape, safe no-op before
init), `src/app/router.test.tsx` (initial-path, `navigate()`,
`popstate`, and unmatched-path tracking, via a mocked
`analytics.service`). All verified passing, alongside the full existing
suite (`npm run lint`, `typecheck`, `test`, `build`). No visible UI
changes to verify in a browser — this feature has no rendered
interface, per the spec's User experience section.
