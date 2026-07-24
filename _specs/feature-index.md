# Feature Index

| Feature | Specification | Status | Dependencies |
| --- | --- | --- | --- |
| Latest Videos | [_specs/features/latest-videos/spec.md](features/latest-videos/spec.md) | Implemented | Requires `VITE_YOUTUBE_API_KEY` (HTTP-referrer-restricted) and `VITE_YOUTUBE_UPLOADS_PLAYLIST_ID` in the deployment environment — see `.env.example`. Until the site owner adds real values, the Videos page shows the designed error state (with a link to the YouTube channel) rather than live data; this is expected, not a defect. |

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
