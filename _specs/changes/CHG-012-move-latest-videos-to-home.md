# CHG-012 — Move "Latest videos" from the Videos page to the Home page

## Status

Proposed

## Requested change

Relocate the existing "Latest videos" section (the 6 most recent DavesFunRC
YouTube uploads, per `_specs/features/latest-videos/spec.md`) from the
Videos page to the Home page, positioned directly below the existing
Watch / Read / Build highlights row. The Videos page loses this section —
it is replaced there by the new Playlists feature (tracked separately, see
`_specs/features/videos-playlist-gallery/spec.md`), so this change and that
feature are intended to ship together.

## Reason

The site owner wants the newest uploads visible on the entry point to the
site (Home) rather than requiring a click through to `/videos` first, and
wants the Videos page repurposed to help visitors browse by playlist
instead.

## Current behaviour

- `src/features/home/HomePage.tsx` renders: full-bleed banner, a hero row
  (hero heading/lede + `WeeklyUpdate`), then a 3-card highlights row
  (Watch / Read / Build). Nothing renders below the highlights row.
- `src/features/videos/VideosPage.tsx` renders an `<h1>Videos</h1>`, an
  `<h2>Latest videos</h2>`, and the latest-videos grid: loading state (6
  skeleton placeholders), loaded state (6 `VideoCard`s via `useLatestVideos`
  → `videos.service.ts`'s `getLatestVideos`), error state, and empty state.
- The latest-videos implementation (`videos.types.ts`, `videos.service.ts`,
  `useLatestVideos.ts`, `components/VideoCard.tsx` + `.css`) lives entirely
  under `src/features/videos/`.

## Desired behaviour

- `HomePage.tsx` renders a new "Latest videos" section immediately after
  `.home-highlights`, showing the same 6-card grid, same card design
  (thumbnail, title, publish date, "Watch on YouTube"), and the same
  loading / error / empty states as today — content and behaviour are
  unchanged, only the page and surrounding layout context change.
- `VideosPage.tsx` no longer renders a "Latest videos" section. Per the
  companion feature spec, it instead renders the new Playlists section, so
  the page is never left without primary content — but that section's
  design is owned by the feature spec, not this change.
- The latest-videos implementation moves from `src/features/videos/` to
  `src/features/home/`, since Home becomes the feature that owns and
  renders it (per `_specs/architecture.md` §9: feature-specific code lives
  under the feature that uses it).

## wireframes/mockups

Before/after wireframes for both the Home and Videos page: [DavesFunRC —
Proposed Changes for
Review](https://claude.ai/code/artifact/150a9dd3-ce69-4b6f-b522-808523f102de)
("Move latest videos to Home" section). Card design, spacing and colour use
the site's real design tokens; the mockup is layout-accurate, not
pixel-final.

## Change classification

Existing-feature enhancement

## Affected specification

- `_specs/features/latest-videos/spec.md` — Purpose, Scope and Interfaces
  need updating: the page is now `src/features/home/HomePage.tsx`, not
  `src/features/videos/VideosPage.tsx`; the feature's file locations under
  "Interfaces"/"Expected changes" move to `src/features/home/`.
- `_specs/features/videos-playlist-gallery/spec.md` (companion feature) —
  cross-references this change as the reason the Videos page has room for
  the new Playlists section.

## Affected implementation areas

- `src/features/home/HomePage.tsx` — add the "Latest videos" section below
  `.home-highlights`, reusing `useLatestVideos`/`VideoCard` (relocated, see
  below).
- `src/features/home/HomePage.css` — spacing for the new section, matching
  the existing `.home-highlights` rhythm (8-point spacing scale).
- `src/features/videos/VideosPage.tsx` — remove the "Latest videos"
  rendering (`<h2>Latest videos</h2>` and the grid/loading/error/empty
  blocks). Left to the companion feature's implementation to fill the page
  with the new Playlists section in the same pass, so the page is never
  shipped empty.
- File moves (`git mv`, preserving history): `src/features/videos/videos.
  types.ts` → `src/features/home/videos.types.ts`; `videos.service.ts` →
  same; `useLatestVideos.ts` → same; `components/VideoCard.tsx` (+ `.css`)
  → `src/features/home/components/`. Import paths updated accordingly
  (e.g. `HomePage.tsx`'s relative imports; `Button`/`siteConfig` import
  depth changes by one level).
- Test files move with their subject: `videos.service.test.ts`,
  `useLatestVideos.test.ts` relocate to `src/features/home/`; `VideosPage.
  test.tsx`'s latest-videos assertions are removed (replaced by new
  assertions in the companion feature's `VideosPage.test.tsx` work) and a
  new `HomePage.test.tsx` gains coverage for the relocated section
  (loading/loaded/error/empty, ordering, accessible link names) — porting
  the existing `VideosPage.test.tsx` cases rather than rewriting them from
  scratch.
- `_specs/feature-index.md` — "Latest Videos" row/summary updated to
  reflect the new file locations and page.

## Requirements

- REQ-001: The relocated section must be byte-for-byte behaviourally
  identical to today's Videos-page section — same 6-video count, same
  ordering (newest first), same card content, same loading/error/empty
  copy — no redesign as part of this change.
- REQ-002: The new section sits directly below `.home-highlights` in DOM
  order, using the existing 8-point spacing tokens for the gap between
  sections (matching how `.home-hero-row` and `.home-highlights` are
  already spaced).
- REQ-003: Heading level stays `<h2>Latest videos</h2>` (Home's `<h1>` is
  the hero heading, so this is still one level down — no heading-hierarchy
  change per `_specs/design-system.md`).
- REQ-004: No change to `VITE_YOUTUBE_API_KEY` / `VITE_YOUTUBE_UPLOADS_
  PLAYLIST_ID` configuration — same env vars, same values, just consumed
  from `src/features/home/` instead of `src/features/videos/`.

## Acceptance criteria

- Given a visitor loads `/`, when the page renders, then a "Latest videos"
  section with up to 6 video cards (or the loading/error/empty state)
  appears directly below the Watch/Read/Build row.
- Given a visitor loads `/videos`, when the page renders, then no "Latest
  videos" heading or video grid appears there.
- Given the YouTube API is unreachable or unconfigured, when the Home page
  loads, then the existing error-state copy and YouTube-channel fallback
  link render on Home instead of Videos, unchanged otherwise.
- Given the existing `latest-videos` test suite, when it is ported to
  `src/features/home/`, then all cases continue to pass unmodified in
  substance (only import paths/file locations change).

## Regression risks

- Import-path breakage from the file move if any path is missed (mitigated
  by running `npm run typecheck` and `npm run build` after the move, which
  will fail loudly on a broken import).
- The Videos page briefly having no primary content if this change lands
  without the companion Playlists feature — mitigated by implementing both
  together, as noted above.
- `_specs/feature-index.md` and `_specs/features/latest-videos/spec.md`
  going stale if not updated in the same implementation pass (tracked
  under Documentation updates below).

## Out of scope

- Any redesign of the video card, loading/error/empty copy, or video count
  (stays at 6, per CHG-011).
- The Playlists section's own design/content — owned by the companion
  feature spec.
- Any change to `SiteHeader`, `SiteFooter`, `MainNavigation`, or routing.

## Documentation updates

- `_specs/features/latest-videos/spec.md` — update Interfaces/Expected
  changes to the new `src/features/home/` locations and Home page context.
- `_specs/feature-index.md` — update the "Latest Videos" row and
  implementation summary (new file locations, new page).
- This file's Status updated to `Implemented` by `implement-change` on
  completion, per the Definition of done in `CLAUDE.md`.
