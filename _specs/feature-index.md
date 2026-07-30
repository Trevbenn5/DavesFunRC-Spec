# Feature Index

| Feature | Specification | Status | Dependencies |
| --- | --- | --- | --- |
| Latest Videos | [_specs/features/latest-videos/spec.md](features/latest-videos/spec.md) | Implemented | Requires `VITE_YOUTUBE_API_KEY` (HTTP-referrer-restricted) and `VITE_YOUTUBE_UPLOADS_PLAYLIST_ID` in the deployment environment — see `.env.example`. Without real values in the deployment environment, the Home page shows the designed error state (with a link to the YouTube channel) rather than live data; this is expected, not a defect. |
| Google Analytics Tracking | [_specs/features/google-analytics-tracking/spec.md](features/google-analytics-tracking/spec.md) | Implemented | Requires `VITE_GA_MEASUREMENT_ID` in the deployment environment — see `.env.example`. Set as a GitHub Actions repo secret and forwarded to the build in `.github/workflows/deploy-pages.yml` (see [CHG-009](changes/CHG-009-ga-measurement-id-deploy-workflow.md)). Until set, the site functions normally with analytics disabled (no error, no tracking). |
| Home Page Weekly Update | [_specs/features/home-weekly-update/spec.md](features/home-weekly-update/spec.md) | Implemented | None. |
| Videos Playlist Gallery | [_specs/features/videos-playlist-gallery/spec.md](features/videos-playlist-gallery/spec.md) | Implemented | Reuses `VITE_YOUTUBE_API_KEY`/`VITE_YOUTUBE_UPLOADS_PLAYLIST_ID` from Latest Videos — no new config. Same deployment-environment caveat applies. |

## Latest Videos — implementation summary

Originally replaced the Videos page's placeholder content with a "Latest
videos" section fetching the 6 most recent DavesFunRC YouTube uploads
(newest first) from the YouTube Data API v3 `playlistItems.list`
endpoint, client-side, via a feature-local service. Loading shows 6
skeleton placeholders; a fetch failure or missing configuration shows a
plain-language error with a link to the YouTube channel; zero results
shows an empty-state message with the same fallback link. The video
count was increased from 3 to 6 by
[CHG-011](changes/CHG-011-latest-videos-show-six.md).
[CHG-012](changes/CHG-012-move-latest-videos-to-home.md) then relocated
the whole section from the Videos page to the Home page (below the
Watch/Read/Build highlights), and the Videos page picked up the new
Playlists gallery in its place — see the "Videos Playlist Gallery" row
below.

Current files (relocated by CHG-012 via `git mv`, preserving history):
`src/features/home/videos.types.ts`, `videos.service.ts`,
`useLatestVideos.ts`, `components/VideoCard.tsx` (+ `.css`). `HomePage.tsx`
renders the section below `.home-highlights`; `HomePage.css` gained the
matching grid/skeleton/empty styles. `.env.example` at the repo root still
documents the two required `VITE_YOUTUBE_*` values, unchanged by the move.

No shared components or routing were touched by the relocation. No new npm
dependency — native `fetch` only. The no-auth YouTube RSS feed
alternative was investigated and rejected (no CORS support for direct
browser fetch); see the spec's Constraints section.

**Tests**: `src/features/home/videos.service.test.ts` (request
params, response mapping/sorting, thumbnail fallback, error handling),
`useLatestVideos.test.ts` (loading → loaded / error state transitions),
`HomePage.test.tsx` (loading, loaded/ordering, error, empty states,
accessible link names, alongside the existing hero/weekly-update/
highlights coverage). `VideosPage.test.tsx` now only asserts the page
heading. All verified passing, alongside the full existing suite
(`npm run lint`, `typecheck`, `test`, `build`). Visually verified in a
real browser (desktop and mobile) against the live DavesFunRC channel via
a local `.env` — see the Videos Playlist Gallery summary below for the
same verification pass.

## Videos Playlist Gallery — implementation summary

Gives the Videos page (emptied by CHG-012's relocation of Latest Videos)
its own content: a "Playlists" section listing the DavesFunRC channel's
top 5 playlists by video count, each as a card with thumbnail, title, and
a "View playlist" link out to YouTube. Loading shows 5 skeleton
placeholders; fetch failure or missing config shows a plain-language error
with a channel link; zero playlists shows the same fallback as an
empty-state message — mirroring the Latest Videos feature's established
patterns exactly.

New files: `src/features/videos/videos.types.ts` (`PlaylistSummary`),
`videos.service.ts` (`getPlaylists` — new module, since the original file
of that name relocated to `src/features/home/` under CHG-012),
`usePlaylists.ts`, `components/PlaylistCard.tsx` (+ `.css`). No channel-ID
env var was added: `getPlaylists` derives it from the existing
`VITE_YOUTUBE_UPLOADS_PLAYLIST_ID` by swapping its `UU` prefix for `UC`
(YouTube's documented convention) — verified correct against the real
DavesFunRC channel during visual verification. `VideosPage.tsx` renders
the section; `VideosPage.css`'s existing grid/skeleton/empty-state rules
(left in place, unused, by CHG-012) were reused and the skeleton class
renamed from `.video-card-skeleton` to `.playlist-card-skeleton` to match
its new purpose.

No shared components, routing, or `package.json` changes. No new npm
dependency — native `fetch`, same as Latest Videos.

[CHG-013](changes/CHG-013-videos-page-shorts-button.md) added a static
"YouTube Shorts" tile as the grid's final item (once loaded with at least
one playlist), filling the cell left empty when exactly 5 playlist cards
render in the 3-column grid. It's not fetched data — a `ShortsCard`
component reusing `PlaylistCard`'s `.playlist-card` styling with a
`SquarePlay` icon and a "Watch Shorts" link to a new
`siteConfig.externalLinks.youtubeShorts` (`https://www.youtube.com/
@DavesFunRC/shorts`). Does not render during loading, error, or empty
states.

**Tests**: `videos.service.test.ts` (endpoint/params, `UU`→`UC` channel-id
derivation, rank-by-`itemCount`-then-slice, thumbnail fallback, error
handling), `usePlaylists.test.ts` (loading → loaded/error transitions),
`components/PlaylistCard.test.tsx` (title, thumbnail alt text, external
link), `components/ShortsCard.test.tsx` (heading, external Shorts link —
added by CHG-013), `VideosPage.test.tsx` (loading skeletons, ranked order
plus Shorts tile, error, empty states, accessible link names, Shorts tile
absent outside the loaded state — updated by CHG-013). All verified
passing, alongside the
full existing suite (`npm run lint`, `typecheck`, `test`, `build`).
Visually verified in a real browser (desktop and mobile, via a temporary
local Playwright install per the precedent in
`_specs/architecture.md` §35 — not committed) against the live
DavesFunRC channel: both the Home page's relocated Latest Videos section
and the Videos page's new Playlists section render real thumbnails,
titles and working links, with no console errors.

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
come from `src/data/home-weekly-update.md` (a `#` heading line followed by
blank-line-separated paragraphs), parsed at build time by
`src/data/home-weekly-update.ts` via Vite's `?raw` import into a typed
`{ heading: string; body: string[] }` record (Markdown source added by
[CHG-010](changes/CHG-010-weekly-update-markdown-source.md), replacing the
original TS literal) — editing the `.md` file and rebuilding is all a
routine weekly update requires, qualifying as a `CLAUDE.md` Content
fast-path edit (no `CHG-*` spec needed).

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

**Tests**: `home-weekly-update.test.ts` (new, added by CHG-010 — heading
extraction, paragraph splitting, whitespace trimming of the Markdown
parser), `WeeklyUpdate.test.tsx` (heading, alt text present and
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
