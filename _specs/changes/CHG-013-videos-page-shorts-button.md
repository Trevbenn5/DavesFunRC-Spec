# CHG-013 — Add a YouTube Shorts button to the Videos page

## Status

Implemented (2026-07-30)

## Requested change

Add a button/tile on the Videos page that links out to the DavesFunRC
YouTube Shorts feed, placed in the "Playlists" grid's currently-empty
sixth cell (5 playlist cards in a 3-column grid leave one cell blank on
desktop).

No mockup — this reuses `PlaylistCard`'s established visual pattern
(border, radius, shadow, padding, heading, "View"-style `Button`)
unchanged, just with a static icon in place of a fetched thumbnail. It
sits in the same `.videos-page__grid` as the existing playlist cards, so
no new grid/layout CSS is needed.

## Reason

The site owner wants Shorts discoverable from the Videos page without a
separate fetch or section. The Playlists grid (`_specs/features/
videos-playlist-gallery/spec.md`) already renders up to 5 cards in a
3-column grid, which leaves one cell empty on desktop whenever exactly 5
playlists are shown (2 cards in row 2, one gap) — a natural, already-idle
spot for a single static link rather than a new page section.

## Current behaviour

`VideosPage.tsx` renders a "Playlists" heading and, once
`usePlaylists(5)` resolves with at least one playlist, a
`.videos-page__grid` of up to 5 `PlaylistCard`s (each: thumbnail, title,
"View playlist" link). With exactly 5 playlists (the common case per the
feature's `itemCount`-ranked top-5), the 3-column grid renders 3 cards in
row 1 and 2 in row 2, leaving the third cell of row 2 empty. There is
currently no link to YouTube Shorts anywhere on the site.

## Desired behaviour

When the Playlists grid has loaded with at least one playlist (the same
`state.status === 'loaded' && state.playlists.length > 0` branch that
renders `.videos-page__grid` today), a static "YouTube Shorts" tile
renders as the grid's final item, after the playlist cards. It is not
part of the ranked/fetched playlist data — it always renders once that
branch is reached, regardless of how many playlists come back (with 5
playlists it fills the sixth/gap cell; with fewer, it simply follows the
last playlist card, which is an acceptable minor layout variation and not
being special-cased).

The tile visually matches `PlaylistCard`: same card container styling
(`.playlist-card` border/radius/shadow/padding), a heading reading
"YouTube Shorts", a `SquarePlay` icon (`lucide-preact`, already a project
dependency — see `_specs/architecture.md` §35) in place of a thumbnail
image, and a `Button` (`variant="tertiary"`, matching "View playlist")
labelled "Watch Shorts" that opens `siteConfig.externalLinks.
youtubeShorts` in a new tab (external-link handling already built into
`Button`).

The tile does not render during the loading, error, or empty states —
those are unchanged from today (skeletons, error fallback, and
empty-state message respectively), matching the existing feature spec's
scope: the Shorts link is additive content for the loaded grid, not a
replacement for or addition to those states.

## Change classification

Existing-feature enhancement

## Affected specification

`_specs/features/videos-playlist-gallery/spec.md` — Scope, Interfaces,
and Expected changes sections gain a short note describing the sixth,
static Shorts tile as a fixed addition to the Playlists grid (not part of
the fetched/ranked top-5 playlists, no loading/error/empty state of its
own).

## Affected implementation areas

- `src/features/videos/VideosPage.tsx` (feature area: Videos Playlist
  Gallery) — render the new `ShortsCard` as the last item inside
  `.videos-page__grid`, in the existing loaded-with-playlists branch.
- `src/features/videos/components/` (new: `ShortsCard.tsx` + `.css`).
- `src/app/app-config.ts` (shared data module) — additive new field only;
  no existing field changes, so `SiteHeader`, `SiteFooter`, and
  `HomePage` (the module's other three consumers) are unaffected.

No shared UI component, route, or other page is touched.

## Requirements

- New file `src/app/app-config.ts` field: `externalLinks.youtubeShorts:
  'https://www.youtube.com/@DavesFunRC/shorts'`.
- New component `src/features/videos/components/ShortsCard.tsx` (+
  `.css`): a presentational, prop-less component rendering a `.playlist-
  card`-styled container with a `SquarePlay` icon, an `<h3>` reading
  "YouTube Shorts", and a `Button` (`variant="tertiary"`, `href={
  siteConfig.externalLinks.youtubeShorts}`, `aria-label="Watch DavesFunRC
  Shorts on YouTube"`) reading "Watch Shorts".
- `VideosPage.tsx`: import and render `<ShortsCard />` as the final child
  of `.videos-page__grid`, only within the existing `state.status ===
  'loaded' && state.playlists.length > 0` branch. Loading, error, and
  empty-state branches are unmodified.
- No new npm dependency — `lucide-preact` is already installed and used
  elsewhere (`MainNavigation.tsx`).
- New test `src/features/videos/components/ShortsCard.test.tsx`:
  renders the heading text, the icon, and a link with the correct `href`
  and an accessible name that isn't just "Watch Shorts" in isolation
  (matches the feature spec's existing accessible-name convention for
  "View playlist").
- `VideosPage.test.tsx` updated: loaded-state test(s) additionally assert
  a "Watch Shorts" link renders alongside the playlist cards; loading,
  error, and empty-state tests assert no "Watch Shorts" link is present.

## Acceptance criteria

- Given the Playlists grid has finished loading with one or more
  playlists, when the grid renders, then a "YouTube Shorts" tile appears
  as the last item in `.videos-page__grid`.
- Given the "YouTube Shorts" tile is visible, when a visitor activates
  "Watch Shorts", then `https://www.youtube.com/@DavesFunRC/shorts` opens
  in a new tab.
- Given the Playlists grid is loading, has errored, or has zero
  playlists, when that state renders, then no "YouTube Shorts" tile is
  present (unchanged skeleton/error/empty-state behaviour).
- Given a screen-reader user, when the Shorts tile is reached, then the
  link's accessible name includes "Shorts" and "YouTube", not just "Watch
  Shorts" in isolation.
- `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
  build` all pass.

## Regression risks

Low. The change is additive: a new prop-less component and one new
`siteConfig.externalLinks` field (existing three consumers of that object
read unrelated fields, so they're unaffected). `VideosPage.tsx`'s
loading/error/empty branches are untouched; only the already-existing
loaded-with-playlists branch gains one more grid child. The 3-column grid
already wraps automatically, so no CSS layout change is needed for the
common 5-playlists-plus-Shorts (6-item) case; if the channel ever has
fewer than 5 playlists, the Shorts tile simply follows the last one
rather than sitting in a "gap" — a cosmetic variation, not a functional
regression.

## Out of scope

- Fetching or displaying actual individual Shorts videos in-page — this
  is a single static outbound link, not a Shorts feed or player.
- Any change to the ranked top-5 playlist fetch, `getPlaylists`,
  `usePlaylists`, or `PlaylistCard` itself.
- Any change to the Home, 3D Designs, Suggestions, or About pages, or to
  `SiteHeader`/`SiteFooter`/other shared layout.
- Showing the Shorts tile during loading, error, or empty states.

## Documentation updates

- `_specs/features/videos-playlist-gallery/spec.md` — Scope, Interfaces,
  and Expected changes sections updated to describe the static Shorts
  tile (done as part of `implement-change`, per `CLAUDE.md`'s Definition
  of done).
- `_specs/feature-index.md` — Videos Playlist Gallery summary updated to
  mention the added Shorts tile (done as part of `implement-change`).
- `_specs/change-index.md` — new row for this change.
