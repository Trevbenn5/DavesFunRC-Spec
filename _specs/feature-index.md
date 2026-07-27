# Feature Index

| Feature | Specification | Status | Dependencies |
| --- | --- | --- | --- |
| Latest Videos | [_specs/features/latest-videos/spec.md](features/latest-videos/spec.md) | Implemented | Requires `VITE_YOUTUBE_API_KEY` (HTTP-referrer-restricted) and `VITE_YOUTUBE_UPLOADS_PLAYLIST_ID` in the deployment environment — see `.env.example`. Until the site owner adds real values, the Videos page shows the designed error state (with a link to the YouTube channel) rather than live data; this is expected, not a defect. |
| Google Analytics Tracking | [_specs/features/google-analytics-tracking/spec.md](features/google-analytics-tracking/spec.md) | Implemented | Requires `VITE_GA_MEASUREMENT_ID` in the deployment environment — see `.env.example`. Set as a GitHub Actions repo secret and forwarded to the build in `.github/workflows/deploy-pages.yml` (see [CHG-009](changes/CHG-009-ga-measurement-id-deploy-workflow.md)). Until set, the site functions normally with analytics disabled (no error, no tracking). |
| Home Page Weekly Update | [_specs/features/home-weekly-update/spec.md](features/home-weekly-update/spec.md) | Implemented | None. |

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

## Home Page Weekly Update — implementation summary

Adds a narrow "What's Dave working on this week?" column beside the
existing Home hero, so the site owner can post an informal weekly build
update without touching component code. The heading and body paragraphs
come from a new typed data module, `src/data/home-weekly-update.ts`
(`{ heading: string; body: string[] }`) — editing `body` there and
rebuilding is all a routine weekly update requires, qualifying as a
`CLAUDE.md` Content fast-path edit (no `CHG-*` spec needed).

New component `src/features/home/components/WeeklyUpdate.tsx` (+ `.css`)
renders the heading (H2), a small fixed image
(`src/assets/home/foam-sheet-construction.jpg`, re-exported from
`assets/Foam Sheet Construction.jpg` via `sips` at 480px long-edge —
2.5MB source down to 66KB) with descriptive alt text, and a fixed-height
(`220px`) `overflow-y: auto` box holding the body paragraphs. The box has
`role="region"`, `aria-labelledby` pointing at the heading, and
`tabIndex={0}` so it's reachable and scrollable via keyboard, per the
spec's FR-006. The photo is a plain component-level import, not part of
the editable data record, since the site owner confirmed it stays fixed
(only the text rotates weekly).

`HomePage.tsx`'s hero section was wrapped in a new `.home-hero-row` flex
row (hero text + `WeeklyUpdate` side by side on desktop, stacking to a
single column ≤900px, matching the existing highlights breakpoint) —
`HomePage.css` gained `.home-hero-row` and a mobile override; no other
page, route, or shared component was touched.

**Tests**: `WeeklyUpdate.test.tsx` (heading, alt text present and
non-empty, scrollable region present/focusable/contains body paragraphs),
`HomePage.test.tsx` (new file — hero heading, weekly update heading, and
all three existing highlight cards all render together, confirming no
regression). All verified passing alongside the full existing suite
(`npm run lint`, `typecheck`, `test`, `build`); the production build
fingerprints the new image under `dist/assets/`, confirming it was
imported via `src/assets/`, not left unprocessed. Visually verified in a
real browser at desktop and mobile widths (layout, responsive stacking,
image rendering, and that the box's content genuinely overflows its fixed
height and is scrollable).
