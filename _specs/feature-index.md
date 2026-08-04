# Feature Index

| Feature | Specification | Status | Dependencies |
| --- | --- | --- | --- |
| Latest Videos | [_specs/features/latest-videos/spec.md](features/latest-videos/spec.md) | Implemented | Requires `VITE_YOUTUBE_API_KEY` (HTTP-referrer-restricted) and `VITE_YOUTUBE_UPLOADS_PLAYLIST_ID` in the deployment environment — see `.env.example`. Without real values in the deployment environment, the Home page shows the designed error state (with a link to the YouTube channel) rather than live data; this is expected, not a defect. |
| Google Analytics Tracking | [_specs/features/google-analytics-tracking/spec.md](features/google-analytics-tracking/spec.md) | Implemented | Requires `VITE_GTM_CONTAINER_ID` in the deployment environment — see `.env.example`. Set as a GitHub Actions repo secret and forwarded to the build in `.github/workflows/deploy-pages.yml` (originally `VITE_GA_MEASUREMENT_ID`, per [CHG-009](changes/CHG-009-ga-measurement-id-deploy-workflow.md); switched to Google Tag Manager by [CHG-015](changes/CHG-015-switch-to-google-tag-manager.md)). GA4 tracking additionally depends on the site owner configuring a matching tag/trigger inside the GTM container's own web UI — see CHG-015. |
| Home Page Weekly Update | [_specs/features/home-weekly-update/spec.md](features/home-weekly-update/spec.md) | Implemented | None. |
| Videos Playlist Gallery | [_specs/features/videos-playlist-gallery/spec.md](features/videos-playlist-gallery/spec.md) | Implemented | Reuses `VITE_YOUTUBE_API_KEY`/`VITE_YOUTUBE_UPLOADS_PLAYLIST_ID` from Latest Videos — no new config. Same deployment-environment caveat applies. |
| How-To Articles (Read Page) | [_specs/features/how-to-articles/spec.md](features/how-to-articles/spec.md) | Implemented | None. Requires Dave to supply at least one `.pdf`/`.jpg` pair under `src/assets/read/` for the page to show real content — until then it renders the designed empty state, which is expected, not a defect. |
| Suggestions Page | [_specs/features/suggestions-page/spec.md](features/suggestions-page/spec.md) | Specified | None. |

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

## How-To Articles (Read Page) — implementation summary

Adds a new `/read` page so Dave can publish How-To PDF articles himself
with no CMS or backend: he drops a `<slug>.pdf` (the article, formatted
with a large title/graphic at the top per his own convention) and a
matching `<slug>.jpg` (a preview image of that top portion) into
`src/assets/read/`, and the site discovers the pair at build time and
renders it as a card in a tiled, responsive CSS grid.

New files: `src/features/read/read.types.ts` (`ReadArticle`),
`articles.ts` (pairs PDF/JPG files sharing a basename via `import.meta.
glob('/src/assets/read/*.{pdf,PDF,jpg,jpeg,JPG,JPEG}', { eager: true,
query: '?url', import: 'default' })`, title-cases the slug, sorts
alphabetically, silently drops any unpaired file — the pairing logic is
factored into an exported `buildArticles()` pure function so it's
testable without depending on the glob at test time), `ReadPage.tsx` (+
`.css`, grid/empty-state pattern mirroring `VideosPage.css`),
`components/ArticleCard.tsx` (+ `.css` — the whole card is a plain `<a
target="_blank" rel="noopener noreferrer">`, deliberately not using the
shared `Button` component, since `Button`'s `href` handling routes
anything not matching `//` through the SPA router, which would break a
bundled PDF asset URL).

Modified: `src/app/routes.ts` (new `{ path: '/read', label: 'Read' }`
entry — picked up by `MainNavigation` automatically), `src/features/home/
HomePage.tsx` (the existing "Read" highlight card's link changed from the
`/about` placeholder to `/read`, action label "Learn more" → "Read
articles").

No shared components changed, no new npm dependency (native
`import.meta.glob`, same static-asset pipeline already used for images
elsewhere), no new environment variables.

`src/assets/read/` exists but is empty — git doesn't track empty
directories, and no real article files were supplied during this
implementation pass, so the page currently renders its designed empty
state ("No how-to articles yet — check back soon." + a link back to
Home). Dave needs to add real `.pdf`/`.jpg` pairs and rebuild for the
grid to show real cards; this is expected per the spec's FR-007, not a
defect.

**Tests**: `articles.test.ts` (pairing by basename, orphaned-PDF and
orphaned-JPG exclusion, hyphen/underscore title-casing, case-insensitive
extension matching, alphabetical sort, empty input), `components/
ArticleCard.test.tsx` (title heading, thumbnail alt text, link href/
`target`/`rel`), `ReadPage.test.tsx` (heading, one card per mocked
article, empty state with working Home link — `./articles`'s
`readArticles` export mocked via a `vi.hoisted` getter so tests don't
depend on real files existing under `src/assets/read/`), `HomePage.test.
tsx` (new assertion that the "Read" highlight card links to `/read`). All
verified passing alongside the full existing suite: `npm run lint`,
`npm run typecheck`, `npm run test` (71 tests across 20 files), `npm run
build`.

Not visually verified in a real browser: with `src/assets/read/` empty,
a live check would only show the same empty state the automated tests
already assert, so it wasn't judged worth a Playwright session for this
pass. Recommend a follow-up visual check (desktop + mobile grid layout,
card hover/focus states, PDF actually opening in a new tab) once Dave has
added at least one real `.pdf`/`.jpg` pair.

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

Adds page-view tracking across every route. Originally implemented as a
direct `gtag.js` integration (script-injected from
`src/services/analytics.service.ts`, initialised from `src/main.tsx`);
[CHG-015](changes/CHG-015-switch-to-google-tag-manager.md) replaced that
with Google Tag Manager (container `GTM-54ZWZN4W`) after the site owner
reported GA had never detected the tag — investigation confirmed the
direct integration worked end-to-end, but the site owner's verification
method was Tag Manager, which had never been installed.

Current implementation: the standard GTM `<script>`/`<noscript>` snippet
lives directly in `index.html` (loader script immediately after
`<meta charset>`, `<noscript><iframe>` immediately after `<body>`), both
referencing `%VITE_GTM_CONTAINER_ID%` via Vite's built-in HTML env
replacement. `src/services/analytics.service.ts` is reduced to a single
function, `trackPageView(path)`, which pushes
`{ event: 'page_view', page_path: path }` onto `window.dataLayer` — the
"virtual pageview" GTM needs for SPA route changes, since its own base
snippet only fires once, on initial load. `src/main.tsx` no longer
references analytics at all. `src/app/router.tsx`'s `RouterProvider`
still calls `trackPageView(path)` in a `useEffect` on its `path` state,
unchanged since the original implementation, so it fires for the initial
load, `navigate()` calls, `popstate` (back/forward), and unmatched (404)
paths alike.

`VITE_GTM_CONTAINER_ID` replaces `VITE_GA_MEASUREMENT_ID` in
`.env.example` and in the deploy workflow's GitHub Actions secret
forwarding (same mechanism [CHG-009](changes/CHG-009-ga-measurement-id-deploy-workflow.md)
established). GA4 tracking itself now depends on the site owner
completing setup inside the GTM web UI (a GA4 tag triggered by a Custom
Event matching the `page_view` push) — that configuration lives in Tag
Manager, outside this codebase, and isn't verifiable from here.

New files: `tests/unit/index.html.test.ts` (CHG-015). Modified:
`index.html`, `src/services/analytics.service.ts` (+ `.test.ts`, fully
rewritten), `src/main.tsx`, `.env.example`,
`.github/workflows/deploy-pages.yml`, `src/vite-env.d.ts` (new
`*.html?raw` ambient module declaration, mirroring the existing
`*.md?raw` one, so the new index.html test can import its raw source).
No shared layout, page components, routes, or `src/app/router.tsx` were
touched, and no new npm dependency.

**Tests**: `src/services/analytics.service.test.ts` (`trackPageView`
pushes the right shape, initialises `dataLayer` if missing, appends
rather than replaces an existing `dataLayer`), `tests/unit/
index.html.test.ts` (GTM script/noscript present and correctly
positioned, referencing the env placeholder, no leftover `gtag`
reference), `src/app/router.test.tsx` (initial-path, `navigate()`,
`popstate`, and unmatched-path tracking, via a mocked
`analytics.service` — unchanged by this change). All verified passing,
alongside the full existing suite (`npm run lint`, `typecheck`, `test`,
`build`). Verified against a real production build
(`VITE_GTM_CONTAINER_ID=GTM-54ZWZN4W npm run build`): `dist/index.html`
has the container id correctly substituted in both snippets, no leftover
placeholder text. Also verified live in a real browser (local dev
server via a temporary Playwright install, not committed, per
`_specs/architecture.md` §35's precedent): GTM's `gtm.js` request fires,
`window.dataLayer` gets GTM's own bootstrap/`gtm.dom`/`gtm.load` entries
plus the `page_view` push for the initial route, and a further
`page_view` push appears after an in-app navigation — with no console
errors.

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
