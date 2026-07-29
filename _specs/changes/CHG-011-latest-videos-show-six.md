# CHG-011 — Show 6 latest videos instead of 3

## Status

Proposed

## Requested change

Increase the number of latest videos shown on the Videos page
(`_specs/features/latest-videos/spec.md`) from 3 to 6, so visitors see more
of Dave's recent uploads without leaving the site. No other behaviour of
the feature changes: still newest-first, still a card per video (thumbnail,
title, publish date, "Watch on YouTube" link), same loading/error/empty
states.

No mockup — this reuses the existing card-grid pattern unchanged, just with
more items in it. The grid already wraps automatically (`grid-template-
columns: repeat(3, 1fr)` in `VideosPage.css`, collapsing to 1 column
≤900px), so 6 cards render as two rows of three on desktop with no CSS
change needed.

## Change classification

Existing-feature enhancement

## Affected files

- `src/features/videos/VideosPage.tsx` — `LATEST_VIDEO_COUNT` constant
  changes from `3` to `6`. This single constant already drives both the
  fetched video count and the number of skeleton placeholders shown while
  loading, so no other code change is needed here.
- `_specs/features/latest-videos/spec.md` — every reference to "3" tied to
  the video count needs updating to "6": Purpose, Scope, User experience,
  FR-001, FR-004, the "Given the YouTube API returns 3 or more videos..."
  and "Given the Videos page is loading..." acceptance criteria, and the
  "Channel has fewer than 3 uploads" edge case (→ "fewer than 6 uploads").
- No change needed to `VideosPage.css` (grid already wraps), `videos.
  service.ts` / `useLatestVideos.ts` (both already take `count` as a
  parameter, not a hardcoded value), or the existing test files — `videos.
  service.test.ts` and `useLatestVideos.test.ts` already exercise the
  service/hook with arbitrary counts (1, 2, 3) rather than asserting
  against `LATEST_VIDEO_COUNT`, and `VideosPage.test.tsx` doesn't assert
  an exact skeleton/card count, only ordering and content — all keep
  passing unmodified once the constant changes.
- `_specs/feature-index.md` — the "Latest Videos" row/summary's mentions of
  "3 most recent" / "3 skeleton placeholders" get updated to "6" as part of
  `implement-change`'s Definition of done, not this spec commit.
