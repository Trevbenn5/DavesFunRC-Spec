# Feature: Videos Playlist Gallery

## Purpose

Help visitors browse DavesFunRC's YouTube content by topic instead of only
by recency. The Videos page currently shows nothing but the "Latest
videos" list (which is relocating to Home, see `CHG-012`); this feature
gives the page its own reason to exist by listing the channel's top 5
playlists, each with its own thumbnail graphic, linking straight through
to that playlist on YouTube. This fulfils the "gallery categorised by top
5 YouTube Playlists" vision already recorded in `_specs/product.md`'s route
inventory for `/videos`, which the original `latest-videos` feature spec
explicitly deferred as "a separate, larger feature for later."

## Scope

- A "Playlists" section on the Videos page (`src/features/videos/
  VideosPage.tsx`) listing the top 5 playlists on the DavesFunRC YouTube
  channel.
- Each playlist shown as a card: thumbnail graphic, playlist title, and a
  "View playlist" link to the playlist on YouTube (opens in a new tab,
  reusing `Button`'s existing external-link handling).
- Loading, error and empty states for the live data fetch, matching the
  conventions already established by the (relocating) latest-videos
  feature.
- This feature assumes `CHG-012` (moving "Latest videos" off this page) is
  implemented in the same pass, so the Videos page ends up with exactly one
  primary section (Playlists), not two, and is never shipped without
  content.

## Out of scope

- Browsing/playing the videos inside a playlist in-page — cards link out
  to YouTube; they don't expand or embed playlist contents.
- Any playlist beyond the top 5 (see Open questions for how "top" is
  defined) — this is not the full "every playlist" catalogue.
- Any change to the Home, 3D Designs, Suggestions or About pages.
- Any change to `SiteHeader`, `SiteFooter`, or other shared layout.
- The relocated "Latest videos" section itself — that's `CHG-012`'s scope,
  not this feature's.

## User stories

- As a visitor, I want to find videos on a specific topic (e.g. slope
  soaring, scratch builds) without scrubbing through 100+ uploads, so I can
  get to what I'm interested in faster.
- As Dave, I want the Videos page to reflect my channel's playlist
  structure automatically, without hand-maintaining a list of links.

## User experience

On loading `/videos`, a "Playlists" section fetches and shows up to 5
playlist cards. While loading, 5 skeleton card placeholders show (matching
the existing latest-videos loading pattern). If the fetch fails or the API
isn't configured, a clear message explains the playlists couldn't be
loaded right now and links to the YouTube channel directly as a fallback.
Each loaded card shows the playlist's thumbnail graphic and title, and a
"View playlist" action that opens the playlist on YouTube in a new tab.

## Functional requirements

- FR-001: The Videos page fetches the channel's playlists and ranks them
  by number of videos they contain (`contentDetails.itemCount`),
  descending, showing the top 5.
- FR-002: Each playlist is rendered as a card showing: thumbnail image and
  title.
- FR-003: Each card has a "View playlist" link to `https://www.youtube.
  com/playlist?list={playlistId}`, opening in a new tab (reusing `Button`'s
  existing `target="_blank" rel="noopener noreferrer"` handling).
- FR-004: While the fetch is in flight, 5 skeleton placeholders render in
  place of the cards.
- FR-005: If the fetch fails (network error, quota exceeded, missing/
  invalid API key), a single error message explains the playlists couldn't
  be loaded and links to the YouTube channel directly as a fallback — no
  raw error text or stack trace shown to the user.
- FR-006: If the channel legitimately has zero playlists, an empty-state
  message shows instead of an empty grid, with a link to the YouTube
  channel.
- FR-007: The playlist list is fetched directly from the browser (no
  server-side component — this is a static site), via the existing
  `videos.service.ts` module.

## Non-functional requirements

- **Accessibility**: thumbnail images have `alt` text naming the playlist
  (e.g. `alt="{playlist title} — DavesFunRC"`); the "View playlist" link's
  accessible name includes the playlist title, not just "View playlist" in
  isolation; skeleton loaders are hidden from assistive tech
  (`aria-hidden`) with a single "Loading playlists…" live-region
  announcement instead; colour contrast and focus states follow existing
  `VideoCard`/`Card` conventions.
- **Security**: reuses the existing `VITE_YOUTUBE_API_KEY` (already
  restricted to HTTP referrers per the latest-videos feature) — no new key
  or secret introduced.
- **Performance**: `playlists.list` costs 1 quota unit per call (same
  order of magnitude as the existing `playlistItems.list` usage), fetched
  once per page load — negligible addition to the existing quota budget.
- **Privacy**: no user data is sent to YouTube; read-only, unauthenticated
  public-data fetch, same as the existing latest-videos integration.
- **Supportability**: the new fetch is a second exported function in the
  existing `videos.service.ts` (`getPlaylists`), keeping all YouTube Data
  API access behind the one service module per `_specs/architecture.md`
  §18.

## Data requirements

- `PlaylistSummary` (feature-local type, added to `src/features/videos/
  videos.types.ts`):
  - `id: string` — YouTube playlist ID
  - `title: string`
  - `thumbnailUrl: string` (`snippet.thumbnails.medium.url` or similar)
  - `itemCount: number` (`contentDetails.itemCount` — used for ranking,
    not displayed)
  - `playlistUrl: string` (derived: `https://www.youtube.com/playlist?
    list={id}`)
- No local persistence — fetched fresh on each page load, same as
  latest-videos.
- Required configuration: reuses `VITE_YOUTUBE_API_KEY` (already required
  by the latest-videos feature — no new env var for the key itself).
- **New requirement**: the channel ID (not the uploads-playlist ID) is
  needed for `playlists.list`. Rather than adding a third `VITE_YOUTUBE_*`
  var, this is derived from the existing `VITE_YOUTUBE_UPLOADS_PLAYLIST_ID`
  by swapping its `UU` prefix for `UC` — YouTube's documented, stable
  convention that a channel's uploads-playlist ID and channel ID share the
  same suffix (e.g. uploads `UUxxxxxxxx` ↔ channel `UCxxxxxxxx`). See Open
  questions for confirmation.

## Interfaces

- **Page**: `src/features/videos/VideosPage.tsx` — adds a "Playlists"
  section. Exact position/heading structure depends on `CHG-012` landing
  first (or together), since that change removes the section currently
  above it.
- **Service**: extends the existing `src/features/videos/videos.
  service.ts` with `getPlaylists(): Promise<PlaylistSummary[]>`, calling
  `https://www.googleapis.com/youtube/v3/playlists` (`part=snippet,
  contentDetails`, `channelId=...`, `maxResults=50`), then sorting by
  `itemCount` descending and slicing to 5 client-side (mirrors
  `getLatestVideos`'s existing sort-then-slice pattern).
- **Hook**: a new feature-local hook `usePlaylists.ts`, structurally
  identical to `useLatestVideos.ts` (`idle`/`loading`/`loaded`/`error`
  local state).
- **Component**: a new feature-local `PlaylistCard` component (`src/
  features/videos/components/PlaylistCard.tsx` + `.css`), visually
  consistent with `VideoCard`'s conventions (border, radius, shadow,
  spacing tokens, thumbnail slot) but without a publish-date line.
- **External integration**: YouTube Data API v3 (`https://www.
  googleapis.com/youtube/v3/playlists`), documented here per
  `_specs/architecture.md` §18.

## Existing components to reuse

- `Button` (`src/components/ui/Button.tsx`) for "View playlist" — same
  external-link handling as "Watch on YouTube".
- `VideoCard`'s CSS conventions as the styling baseline for the new
  `PlaylistCard` (same tokens: `--radius-card`, `--shadow-small`).
- `siteConfig.externalLinks.youtube` (`src/app/app-config.ts`) as the
  fallback link in error/empty states.
- The existing skeleton-loader pattern from `VideosPage.css`
  (`.video-card-skeleton`, `skeleton-pulse` animation) — reused/renamed
  for playlist skeletons rather than duplicated.

## Expected changes

- `src/features/videos/VideosPage.tsx` — add the "Playlists" section
  (coordinated with `CHG-012` removing the "Latest videos" section from
  the same file).
- `src/features/videos/videos.service.ts` — add `getPlaylists`.
- `src/features/videos/videos.types.ts` — add `PlaylistSummary`.
- `src/features/videos/usePlaylists.ts` — new.
- `src/features/videos/components/PlaylistCard.tsx` (+ `.css`) — new.
- `src/features/videos/VideosPage.css` — grid styles for the playlist
  cards (likely reusing `.videos-page__grid`'s existing 3-column/1-column
  responsive pattern).
- `src/features/videos/videos.service.test.ts`, a new `usePlaylists.
  test.ts`, and updated `VideosPage.test.tsx` — new/updated, with `fetch`
  mocked.
- No changes to shared components, routing, `package.json`, or any other
  page.

## Constraints

- Static site, no server (`_specs/architecture.md` §2, §4) — fetch happens
  entirely client-side, same constraint as latest-videos.
- No new npm dependency — native `fetch` is sufficient.
- Must not introduce a second, separately-restricted API key — reuses the
  existing `VITE_YOUTUBE_API_KEY`.

## Edge cases

- **API key missing/not configured**: same as latest-videos — treated as a
  fetch failure, error state shown, no crash.
- **Channel has fewer than 5 playlists**: show however many are returned
  rather than an error — only truly zero playlists is the empty state
  (FR-006).
- **A playlist has zero videos** (`itemCount: 0`): still eligible to be
  shown if it ranks in the top 5 by that same metric (i.e. only relevant
  when the channel has fewer than 5 non-empty playlists) — no special
  casing needed.
- **Channel has more than 50 playlists**: `playlists.list`'s single-page
  `maxResults=50` cap could in theory miss some — treated as acceptable
  for this feature since only the top 5 by size are shown and pagination
  adds complexity disproportionate to the risk; flagged as an Open
  question in case the real channel is close to that limit.

## Acceptance criteria

- Given the Videos page is loading the playlist list, when the fetch is in
  flight, then 5 skeleton placeholders are shown in place of playlist
  cards.
- Given the YouTube API returns 5 or more playlists, when the fetch
  completes, then exactly the 5 playlists with the most videos are shown.
- Given a shown playlist card, when a visitor activates "View playlist",
  then the playlist opens on youtube.com in a new tab.
- Given the API request fails for any reason, when the failure occurs,
  then the page shows a plain-language error message and a link to the
  YouTube channel, with no raw error/stack trace visible.
- Given the API returns zero playlists, when the fetch completes, then an
  empty-state message and a link to the YouTube channel are shown instead
  of an empty section.
- Given a screen-reader user, when the section loads, then thumbnail
  images and "View playlist" links have accessible names that include the
  playlist title.

## Open questions

- **Definition of "top 5"**: this spec ranks by video count
  (`itemCount`), since that's available in the same API call with no extra
  quota cost. If the site owner would rather curate the 5 manually, or
  rank by a different signal (e.g. most recently updated), that's a
  different, simpler implementation (a hardcoded list of 5 playlist IDs)
  and should be raised before implementation starts.
- **Channel ID derivation**: assumes the `UU` → `UC` prefix swap on
  `VITE_YOUTUBE_UPLOADS_PLAYLIST_ID` correctly yields the channel ID. This
  is YouTube's documented convention and not expected to fail, but hasn't
  been verified against the live DavesFunRC channel yet (the real API key/
  playlist ID aren't configured — see `latest-videos`' Open questions,
  still unresolved as of this spec).
- **Pagination beyond 50 playlists**: not handled (see Edge cases) — raise
  if the channel is known to have more than 50 playlists.

## Tests

- Unit: `videos.service.ts`'s `getPlaylists` — mock `global.fetch`, verify
  correct endpoint/params, correct `UU`→`UC` channel-ID derivation,
  correct mapping to `PlaylistSummary[]`, correct sort-by-`itemCount`-then-
  slice-to-5, and error handling when `fetch` rejects or returns non-2xx.
- Unit: `usePlaylists.ts` — verify `loading` → `loaded`/`error` state
  transitions.
- Component: `PlaylistCard` renders title, thumbnail (with correct `alt`),
  and a working external "View playlist" link.
- Component/integration: `VideosPage` — loading state shows 5 skeletons;
  loaded state shows up to 5 cards in ranked order; error state shows the
  fallback message and YouTube channel link; empty state shows the
  empty-state message. Extends the existing `VideosPage.test.tsx` pattern
  with `fetch` mocked via `vi.fn()`.

## Completion

_specs/feature-index.md updated with this feature's row (Status:
Specified) as part of this spec's commit.
