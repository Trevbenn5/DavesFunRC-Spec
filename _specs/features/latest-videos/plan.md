# Plan: Latest Videos

## Decisions carried from spec review

- Build the feature fully now, reading `VITE_YOUTUBE_API_KEY` and
  `VITE_YOUTUBE_UPLOADS_PLAYLIST_ID` from env vars that aren't set in this
  repo yet. Until the site owner adds real values to their deployment
  secrets, the page shows the designed error state (FR-005) rather than
  live data — this is expected, not a bug.
- The new "Latest videos" section **replaces** `VideosPage`'s current
  `PlaceholderPage` content entirely (per the site owner's answer), not
  alongside it.
- Publish-date format: relative ("3 days ago"), falling back to an
  absolute short date once older than ~30 days. Either satisfies the
  spec's acceptance criteria; this is the implementation's choice per the
  spec's Open Questions.

## Existing components to reuse

- `Button` (`src/components/ui/Button.tsx`) — external-link handling
  (`target="_blank" rel="noopener noreferrer"`) for "Watch on YouTube",
  and for the channel link in error/empty states.
- `siteConfig.externalLinks.youtube` (`src/app/app-config.ts`) — fallback
  link in error/empty states.
- `.visually-hidden` utility (`src/styles/utilities.css`) — for the
  loading live-region text.
- Design tokens already used by `Card`/`PlaceholderPage`
  (`--radius-card`, `--shadow-small`, `--space-*`) — reused by the new
  `VideoCard` and page-level CSS rather than inventing new values.
- Global `prefers-reduced-motion` handling already in `src/styles/
  reset.css` — no need for a component-level duplicate for the skeleton
  pulse animation.

## Files expected to change

- `src/features/videos/VideosPage.tsx` — replace `PlaceholderPage` usage
  with the loading/loaded/error/empty states described in the spec.

## New files

- `src/features/videos/videos.types.ts` — `VideoSummary` type.
- `src/features/videos/videos.service.ts` — `getLatestVideos(count)`,
  calling YouTube Data API v3 `playlistItems.list` on the uploads
  playlist. Reads env vars **inside** the function body (not at module
  top-level) so tests can `vi.stubEnv` per-test without module-registry
  gymnastics.
- `src/features/videos/useLatestVideos.ts` — hook wrapping the service
  call in local `loading | loaded | error` state.
- `src/features/videos/components/VideoCard.tsx` + `VideoCard.css` —
  thumbnail + title (`h3`) + relative date + watch action.
- `src/features/videos/VideosPage.css` — grid layout, skeleton
  placeholder styling, empty/error state layout.
- `src/features/videos/videos.service.test.ts`
- `src/features/videos/useLatestVideos.test.ts`
- `src/features/videos/VideosPage.test.tsx`
- `.env.example` — documents both `VITE_YOUTUBE_*` values and how to
  obtain them (repo root; `.env` itself stays untracked per `.gitignore`).

## Data or API changes

- New external integration: YouTube Data API v3, `playlistItems.list`
  endpoint, `part=snippet`, `playlistId=<uploads playlist>`,
  `maxResults=3`, `key=<VITE_YOUTUBE_API_KEY>`. Response mapped to
  `VideoSummary[]`, sorted client-side by `publishedAt` descending as a
  defensive measure (see spec's Interfaces section), truncated to
  `count`. No new npm dependency — native `fetch`/`JSON`.

## Tests to add or update

- `videos.service.test.ts`: missing-config throws; happy path asserts
  the request URL/params and the mapped+sorted result; non-2xx response
  throws.
- `useLatestVideos.test.ts`: `loading` → `loaded` and `loading` → `error`
  transitions, via `renderHook`/`waitFor` from `@testing-library/preact`
  (already a dependency; no new test tooling needed), mocking
  `videos.service`.
- `VideosPage.test.tsx`: loading shows the live-region + skeletons;
  loaded shows cards in the right order with working external watch
  links; error shows the fallback message + channel link; empty shows
  the empty-state message + channel link. Mocks `videos.service`
  directly (simplest seam — avoids re-mocking `fetch` at this layer).
- No existing tests are expected to change — `tests/unit/App.test.tsx`
  only asserts the Videos route renders an `<h1>` reading "Videos",
  which this implementation keeps.

## Dependencies

None new. Uses existing `preact`, `@testing-library/preact`, `vitest`.

## Risks

- Reading `import.meta.env` inside the function (not at module scope) is
  slightly unconventional but necessary for clean per-test env stubbing;
  documented here so it isn't "fixed" into a top-level constant later
  without re-checking testability.
- Without a real API key, this can only be verified against mocked data,
  not a live response shape — if YouTube's actual response shape differs
  subtly from the mapping assumed here (e.g. a channel with no
  `thumbnails.medium`), the fallback to `thumbnails.default` should cover
  it, but this is unverified against the real API.

## Acceptance criteria mapping

- "3 skeletons while loading" → `VideosPage.test.tsx` loading case.
- "3 most recent, newest first" → `videos.service.test.ts` mapping/sort
  assertions + `VideosPage.test.tsx` ordering assertion.
- "Watch on YouTube opens in a new tab" → `VideosPage.test.tsx` link
  `target`/`href` assertions.
- "Fetch failure → plain-language error + channel link" →
  `VideosPage.test.tsx` error case.
- "Zero videos → empty state + channel link" → `VideosPage.test.tsx`
  empty case.
- "Accessible names include video title" → `VideosPage.test.tsx` link
  name assertion (`Watch "Newest video" on YouTube`) and `VideoCard`
  thumbnail `alt` text.
