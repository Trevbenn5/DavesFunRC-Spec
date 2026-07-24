# Feature: Latest Videos

## Purpose

Give visitors to the Videos page a reason to check back: show the 3 most
recently uploaded DavesFunRC YouTube videos, newest first, pulled live from
the channel rather than hand-maintained. Currently the Videos page shows no
videos at all — just placeholder text — so this is new capability, not a
change to existing behaviour (per `CLAUDE.md`'s Change vs Feature rule).

## Scope

- A "Latest videos" section on the existing Videos page
  (`src/features/videos/VideosPage.tsx`) showing the 3 most recent uploads
  from the DavesFunRC YouTube channel, ordered newest first.
- Each video shown as a card: thumbnail, title, published date, and a link
  to watch it on YouTube (opens in a new tab, reusing the existing
  external-link handling already in `Button`).
- Loading, error and empty states for the live data fetch.

## Out of scope

- The full "gallery categorised by top 5 YouTube Playlists" vision from
  `_specs/product.md`'s route inventory for `/videos`. This feature is
  only the "latest 3 uploads" slice; the categorised playlist gallery is a
  separate, larger feature for later.
- Embedding playable video (YouTube iframe embeds) — cards link out to
  YouTube; they don't play video in-page.
- Caching the API response across visits (e.g. in `localStorage`) to
  reduce API quota usage. A plain fetch on page load is enough for this
  feature; caching can be added later if quota becomes a real problem.
- Any change to the Home, 3D Designs, Suggestions or About pages.
- Any change to `SiteHeader`, `SiteFooter`, or other shared layout.

## User stories

- As a visitor, I want to see the newest DavesFunRC videos without leaving
  the site, so I don't have to go to YouTube just to check what's new.
- As Dave, I want the Videos page to stay current automatically as I
  upload, without having to hand-edit the website every time.

## User experience

On loading `/videos`, above (or instead of, see Interfaces) today's
placeholder text, a "Latest videos" section fetches and shows 3 video
cards ordered newest-first by publish date. While loading, 3 skeleton
card placeholders show (per `_specs/design-system.md`'s "prefer skeleton
loaders" rule). If the fetch fails or the API isn't configured, a clear
message explains that the videos couldn't be loaded right now and links
to the YouTube channel directly instead (using the existing
`siteConfig.externalLinks.youtube`) as the fallback next step. Each
loaded card shows the video's thumbnail, title, and publish date, and a
"Watch on YouTube" action that opens the video in a new tab.

## Functional requirements

- FR-001: The Videos page fetches the 3 most recent videos uploaded to
  the DavesFunRC YouTube channel, ordered by publish date descending
  (newest first).
- FR-002: Each video is rendered as a card showing: thumbnail image,
  title, publish date (human-readable, e.g. "3 days ago" or a short
  date), and a "Watch on YouTube" link to the video's `watch?v=` URL.
- FR-003: The "Watch on YouTube" link opens in a new tab (reusing
  `Button`'s existing external-link handling: `target="_blank" rel="noopener
  noreferrer"`).
- FR-004: While the fetch is in flight, 3 skeleton placeholders render in
  place of the cards (matching each card's approximate size, per the
  design system's loading-state rule).
- FR-005: If the fetch fails (network error, quota exceeded, missing/
  invalid API key), a single error message explains the videos couldn't
  be loaded and links to the YouTube channel directly as a fallback — no
  raw error text or stack trace shown to the user.
- FR-006: If the API legitimately returns zero videos, an empty-state
  message shows instead of an empty grid, with a link to the YouTube
  channel.
- FR-007: The video list is fetched directly from the browser (no
  server-side component — this is a static site), via a typed service
  module.

## Non-functional requirements

- **Accessibility**: thumbnail images have `alt` text naming the video
  (e.g. `alt="{video title} — DavesFunRC"`); the watch link's accessible
  name includes the video title, not just "Watch on YouTube" in
  isolation, so it's meaningful out of context for screen-reader users;
  skeleton loaders are hidden from assistive tech (`aria-hidden`) with a
  single "Loading latest videos…" live-region announcement instead;
  colour contrast and focus states follow existing `Card`/`Button`
  conventions.
- **Security**: the YouTube Data API key is a public, client-exposed
  value (unavoidable for a static site with no backend) and **must** be
  restricted in Google Cloud Console to HTTP referrers on the production
  domain (and `localhost` for development) — this is Google's own
  documented pattern for browser-side API key usage, not a workaround.
  No private/unrestricted key may be committed or used.
- **Performance**: use the channel's uploads-playlist `playlistItems.list`
  endpoint (1 quota unit per call) rather than `search.list` (100 quota
  units per call) — both return the same "latest N uploads, newest
  first" result for this use case, but `playlistItems.list` is ~100×
  cheaper against the API's free daily quota (10,000 units/day).
- **Privacy**: no user data is sent to YouTube; this is a read-only,
  unauthenticated public-data fetch.
- **Supportability**: the service module is isolated (see Interfaces)
  so the data source could later be swapped (e.g. for a caching layer)
  without touching the page/component.

## Data requirements

- `VideoSummary` (feature-local type, e.g.
  `src/features/videos/videos.types.ts`):
  - `id: string` — YouTube video ID
  - `title: string`
  - `publishedAt: string` (ISO 8601, from the API's `snippet.publishedAt`)
  - `thumbnailUrl: string` (`snippet.thumbnails.medium.url` or similar)
  - `watchUrl: string` (derived: `https://www.youtube.com/watch?v={id}`)
- No local persistence. Data is fetched fresh on each page load; nothing
  is written to `localStorage`/`sessionStorage` (see Out of scope).
- Required configuration (all `VITE_`-prefixed, per
  `_specs/architecture.md` §20 — treated as public):
  - `VITE_YOUTUBE_API_KEY` — a YouTube Data API v3 key, restricted by
    HTTP referrer (see Non-functional requirements).
  - The channel's **uploads playlist ID** (not the channel ID) — this
    can be resolved once via `channels.list?forHandle=DavesFunRC&
    part=contentDetails` (needs the API key to look up) and then stored
    as a plain config constant (e.g. in `src/app/app-config.ts` or
    `videos.service.ts`) — it does not need to be re-resolved on every
    page load. See Open questions.

## Interfaces

- **Page**: `src/features/videos/VideosPage.tsx` — currently renders only
  `PlaceholderPage`. This feature adds a "Latest videos" section above or
  alongside that placeholder content (see Open questions on whether the
  placeholder copy is replaced or kept as a secondary note about the
  full playlist gallery still to come).
- **Service**: a new feature-local `src/features/videos/videos.service.ts`
  exporting a typed function (e.g. `getLatestVideos(count: number):
  Promise<VideoSummary[]>`) that calls the YouTube Data API v3
  `playlistItems.list` endpoint directly via `fetch()` (no new npm
  dependency — native `fetch` and `JSON.parse` are sufficient; the
  YouTube RSS feed alternative was rejected, see Constraints).
- **Hook**: a small feature-local hook (e.g.
  `src/features/videos/useLatestVideos.ts`) wrapping the service call in
  local component state (`idle` / `loading` / `loaded` / `error`), per
  `_specs/architecture.md` §11 (no state-management library).
- **Component**: a feature-local `VideoCard` component (e.g.
  `src/features/videos/components/VideoCard.tsx`) — visually consistent
  with the shared `Card` component's conventions (border, radius, shadow,
  spacing tokens) but with a thumbnail slot that `Card` doesn't currently
  have. Kept feature-local rather than added to the shared `Card`
  (mirrors the same reasoning `CHG-002` used to defer adding an image
  slot to `Card`) unless a second feature needs the same thumbnail-card
  layout, at which point it should be promoted to `src/components/ui/`.
- **External integration**: YouTube Data API v3
  (`https://www.googleapis.com/youtube/v3/playlistItems`), documented
  here per `_specs/architecture.md` §18's requirement that every external
  service be documented in its feature specification.

## Existing components to reuse

- `Button` (`src/components/ui/Button.tsx`) for the "Watch on YouTube"
  action — already handles external links (`target="_blank" rel="noopener
  noreferrer"`) via its `isExternal` check.
- `Card`'s visual conventions (`src/components/ui/Card.css` tokens:
  `--radius-card`, `--shadow-small`, spacing) as the styling baseline for
  the new `VideoCard`, even though `VideoCard` is a separate component.
- `siteConfig.externalLinks.youtube` (`src/app/app-config.ts`) as the
  fallback link shown in the error and empty states.
- `PlaceholderPage` conventions (`src/components/content/PlaceholderPage.
  css`'s spacing) for consistent section padding on the Videos page.

## Expected changes

- `src/features/videos/VideosPage.tsx` — add the "Latest videos" section.
- `src/features/videos/videos.service.ts` — new.
- `src/features/videos/videos.types.ts` — new.
- `src/features/videos/useLatestVideos.ts` — new.
- `src/features/videos/components/VideoCard.tsx` (+ `.css`) — new.
- `src/features/videos/VideosPage.test.tsx` and/or
  `useLatestVideos.test.ts` — new, with `fetch` mocked (no new test
  dependency needed).
- `.env.example` or equivalent documentation of the two required
  `VITE_YOUTUBE_*` values (see Data requirements) — new, since these
  don't exist anywhere in the project yet.
- No changes to shared components, routing, other pages, or
  `package.json`.

## Constraints

- Static site, no server (`_specs/architecture.md` §2, §4) — the fetch
  must happen entirely client-side.
- The YouTube RSS feed (`https://www.youtube.com/feeds/videos.xml?
  channel_id=...`), which would have avoided needing an API key entirely,
  was investigated and **rejected**: it does not send an
  `Access-Control-Allow-Origin` header, so a browser `fetch()` from
  `davesfunrc.com` would be blocked by CORS with no way to work around it
  from a purely static site (no server to proxy the request through, per
  architecture's "no continuously running application server"
  constraint). The YouTube Data API v3 does support direct browser
  `fetch()` calls (Google's own documented pattern, using an HTTP-
  referrer-restricted key), so it's the only viable approach without
  introducing a serverless proxy — which would be an architectural
  change out of scope for this feature.
- No new npm dependency (`_specs/architecture.md` §29) — native `fetch`
  and the JSON API are sufficient.
- `VITE_`-prefixed env vars are public by definition
  (`_specs/architecture.md` §20) — the API key must be treated as such
  and secured via referrer restriction, not by trying to hide it.

## Edge cases

- **API key missing/not configured** (e.g. local dev without the env
  var set): treated the same as a fetch failure — show the error state,
  don't crash the page.
- **API key invalid or quota exceeded**: same error state; the service
  module should distinguish this in a `console.error` for developers but
  must not expose the raw API error to the visitor.
- **Channel has fewer than 3 uploads**: show however many are returned
  (0, 1 or 2) rather than an error — only truly zero videos is the empty
  state (FR-006).
- **Slow network**: skeleton loaders (FR-004) prevent a blank page while
  waiting; no specific timeout is required beyond the browser's own
  default `fetch` behaviour.
- **A video is later deleted/made private on YouTube** after being
  fetched: out of scope to handle specially — the next page load will
  simply no longer include it.

## Acceptance criteria

- Given the Videos page is loading the video list, when the fetch is in
  flight, then 3 skeleton placeholders are shown in place of video cards.
- Given the YouTube API returns 3 or more videos, when the fetch
  completes, then exactly the 3 most recently published videos are
  shown, ordered newest first.
- Given a shown video card, when a visitor activates "Watch on YouTube",
  then the video opens on youtube.com in a new tab.
- Given the API request fails for any reason (network error, missing/
  invalid key, quota exceeded), when the failure occurs, then the page
  shows a plain-language error message and a link to the YouTube channel,
  with no raw error/stack trace visible.
- Given the API returns zero videos, when the fetch completes, then an
  empty-state message and a link to the YouTube channel are shown
  instead of an empty section.
- Given a screen-reader user, when the section loads, then thumbnail
  images and watch links have accessible names that include the video
  title.

## Open questions

- **Does the site owner already have a YouTube Data API v3 key?** This
  feature cannot fetch real data without one (restricted by HTTP
  referrer to the production domain, per Non-functional requirements).
  This needs to be provided before `implement-feature` can produce a
  working (not just structurally-complete) result.
- **What is the channel's uploads playlist ID?** Needs a one-off lookup
  via `channels.list?forHandle=DavesFunRC&part=contentDetails` once a
  key exists (see Data requirements) — not a business-rule question, just
  a lookup blocked on having a key.
- **Does the existing placeholder copy stay on the Videos page
  alongside the new "Latest videos" section**, framing it as a preview
  of the fuller categorised gallery still to come, or does the new
  section fully replace the placeholder for now? Left to
  `implement-feature` to propose, or the site owner to confirm, since
  it's a content/framing choice, not specified here.
- **Human-readable date format** for "publish date" (FR-002) — e.g.
  relative ("3 days ago") vs. absolute ("14 Jul 2026") — not specified;
  either satisfies the acceptance criteria, so left as an implementation
  choice unless the site owner has a preference.

## Tests

- Unit: `videos.service.ts` — mock `global.fetch`, verify the correct
  endpoint/params are used (uploads playlist, `maxResults=3`), and that
  the response is mapped to `VideoSummary[]` correctly, including error
  handling when `fetch` rejects or the API returns a non-2xx response.
- Unit: `useLatestVideos.ts` — verify the `loading` → `loaded`/`error`
  state transitions.
- Component: `VideoCard` renders title, thumbnail (with correct `alt`),
  publish date, and a working external watch link.
- Component/integration: `VideosPage` — loading state shows 3 skeletons;
  loaded state shows 3 cards in the right order; error state shows the
  fallback message and YouTube channel link; empty state shows the
  empty-state message. Extends the existing pattern in
  `tests/unit/App.test.tsx` / co-located feature tests (e.g.
  `Button.test.tsx`) using `@testing-library/preact` with `fetch` mocked
  via `vi.fn()` — no new test dependency needed.
