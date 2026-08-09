# CHG-016 — Home page welcome text and workbench images

## Status

Implemented (2026-08-09)

## Requested change

Two related updates to the Home page hero section:

1. Replace the welcome paragraph under "G'day, welcome to DavesFunRC" with
   new copy, and add a full-width photo (`assets/Dave Launching Plane.png`)
   below it.
2. Add two more photos (`assets/Foam Sheet Construction.jpg` and
   `assets/Daves Workbench.png`), side by side, above the "What's Dave
   working on this week?" heading — replacing the single small thumbnail
   that box currently shows.

The site owner confirmed the existing two-column hero layout (flexible
welcome column on the left, ~280px "What's Dave working on this week?"
column on the right) must not change shape or position — both new images
are inserted inside their respective existing columns, at that column's
existing width, not as full-bleed or full-page-width banners.

See the wireframe (desktop and mobile, existing vs. new elements
labelled):
https://claude.ai/code/artifact/f80ece27-a6fc-4d7d-85cc-e16d50493abc

## Reason

The site owner wants the welcome text to read more like a personal
introduction (what the site offers, in a friendly tone) and wants the
Home page to feel more visually alive above the fold, consistent with the
imagery already added elsewhere on the page (CHG-002/CHG-003's banner,
the existing weekly-update thumbnail).

## Current behaviour

`src/features/home/HomePage.tsx`:

- Renders `.home-hero-row` (`HomePage.css`) as a flex row: `.home-hero`
  (flex: 1 1 auto — heading + lede paragraph only, no image) beside
  `<WeeklyUpdate />` (flex: 0 0 280px).
- The lede paragraph reads: "Store-bought planes, scratch builds and the
  odd slope-soaring adventure — this is the home for everything alongside
  the DavesFunRC YouTube channel."

`src/features/home/components/WeeklyUpdate.tsx`:

- Renders an H2 ("What's Dave working on this week?"), then one fixed
  120×120 image (`src/assets/home/foam-sheet-construction.jpg`, already a
  resized copy of `assets/Foam Sheet Construction.jpg` per the existing
  Home Page Weekly Update feature spec's FR-002), then the scrollable
  body-text box.

Both column widths (flexible hero / fixed 280px aside) are set by
`.home-hero` and `.weekly-update`'s existing `flex` rules and are not
touched by this change.

## Desired behaviour

**1. Welcome copy** — `.home-hero__lede` is replaced with the following
copy (paragraph, bullet list, closing line), lightly tightened from the
site owner's wording for flow, content unchanged:

> Thanks for dropping by! My passion is all about having fun with RC
> planes — I returned to this absorbing hobby in 2022, and I design, build
> and fly planes of all sizes, indoors and out, as well as slope soaring.
>
> On this site you'll find:
> - Links to my YouTube videos
> - 3D printer build designs (3D models)
> - Technical articles to help new starters
> - Suggestions on future projects are welcome…
>
> Enjoy!

Rendered as a paragraph, then a `<ul>`, then a closing paragraph — plain
semantic HTML, no new component.

**2. Welcome image** — `assets/Dave Launching Plane.png` is added directly
below this copy, inside `.home-hero` only. It spans the full width of the
welcome column (`width: 100%` of `.home-hero`, whatever that resolves to
at the current breakpoint) — it does not become full-bleed and does not
change `.home-hero`'s or `.weekly-update`'s `flex` sizing. On mobile it
stacks in place, below the text, above the "What's Dave working on this
week?" column, matching the existing stacking order.

**3. Workbench images** — `assets/Foam Sheet Construction.jpg` and
`assets/Daves Workbench.png` are added inside `WeeklyUpdate.tsx`, side by
side (two-up), above the "What's Dave working on this week?" heading, at
the aside column's existing ~280px width — replacing the single
120×120 `foam-sheet-construction.jpg` thumbnail that currently occupies
that spot. Each image gets roughly half the column width.

All three images get real, descriptive `alt` text (informative content,
not decorative), consistent with CHG-008's precedent for photos that
don't duplicate adjacent heading text.

## Change classification

Design

## Affected specification

`_specs/features/home-weekly-update/spec.md` — FR-002 ("The column
displays one small, fixed image...") and the Data requirements/Interfaces
sections describe a single fixed thumbnail; they need updating to
describe two side-by-side images instead. No other feature specification
exists for the Home page hero (it predates `create-feature-spec`, per
CHG-002's precedent).

## Affected implementation areas

- `src/features/home/HomePage.tsx` — replace the lede paragraph with the
  new copy (paragraph + list + closing line) and add the new
  `<img>` below it, sourced from a new `src/assets/home/` copy of `Dave
  Launching Plane.png`.
- `src/features/home/HomePage.css` — style rules for the new welcome image
  (`width: 100%`, constrained `aspect-ratio`, `object-fit: cover`) and for
  the welcome copy's list (spacing using existing `--space-*` tokens
  only).
- `src/features/home/components/WeeklyUpdate.tsx` — replace the single
  `foam-sheet-construction.jpg` `<img>` with two `<img>`s side by side,
  sourced from `src/assets/home/foam-sheet-construction.jpg` (already
  present) and a new `src/assets/home/daves-workbench.jpg` (re-exported
  from `assets/Daves Workbench.png`).
- `src/features/home/components/WeeklyUpdate.css` — replace
  `.weekly-update__image`'s single-image rule with a two-up row rule
  (flex or grid, `gap` from existing tokens), sized to the aside column's
  existing width.
- New asset files under `src/assets/home/`: a re-exported/resized copy of
  `Dave Launching Plane.png`, and a re-exported/resized copy of
  `Daves Workbench.png` (the existing `foam-sheet-construction.jpg` is
  reused as-is).
- No changes to `Card`, `Button`, routing, navigation, or any other page.

## Requirements

1. All three images are imported from `src/assets/home/` (not `public/`),
   per `_specs/architecture.md` §14, so Vite fingerprints them.
2. The welcome image renders at the welcome column's existing width only;
   it must not change `.home-hero`'s or `.weekly-update`'s `flex` sizing,
   and must not become full-bleed.
3. The two workbench images render side by side at the aside column's
   existing ~280px width, replacing (not supplementing) the current
   single thumbnail — no duplicate image left in the DOM.
4. All three images have non-empty, descriptive `alt` text.
5. The welcome copy is rendered as a paragraph, a `<ul>` of the four
   items, and a closing paragraph — using only existing typography/colour
   tokens, no new component.
6. No horizontal overflow and no broken layout at desktop (~1280px),
   tablet (~768px), and mobile (~390px) widths; the existing
   desktop-two-column / mobile-stacked breakpoint behaviour is unchanged.
7. `_specs/features/home-weekly-update/spec.md` is updated to describe the
   two-image row in place of the single fixed image (see Documentation
   updates).

## Acceptance criteria

- [x] Home page (`/`) shows the new welcome copy (paragraph, four-item
      list, closing line) under the "G'day, welcome to DavesFunRC"
      heading.
- [x] `Dave Launching Plane.png` renders below the welcome copy, full
      width of the welcome column, at desktop, tablet, and mobile widths,
      with the "What's Dave working on this week?" column's width and
      right-hand position unchanged.
- [x] `Foam Sheet Construction.jpg` and `Daves Workbench.png` render side
      by side above the "What's Dave working on this week?" heading, at
      the aside column's existing width; the old single 120×120 thumbnail
      no longer renders.
- [x] All three images have descriptive, non-empty `alt` text (covered by
      `HomePage.test.tsx`/`WeeklyUpdate.test.tsx` assertions using
      `getByAltText`).
- [x] No horizontal overflow at desktop/tablet/mobile widths; mobile
      stacking order matches the existing pattern (banner → hero text →
      welcome image → aside block → highlights).
- [x] The production build (`npm run build`) fingerprints all new image
      files under `dist/assets/`.
- [x] `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
      build` all pass.
- [x] `_specs/features/home-weekly-update/spec.md` reflects the two-image
      row (FR-002, Data requirements, Interfaces).

## Regression risks

- **Asset weight**: source files are large —
  `assets/Dave Launching Plane.png` is 3.1MB (1906×876),
  `assets/Foam Sheet Construction.jpg` is 2.4MB (already has a 66KB
  resized copy in `src/assets/home/` to reuse), and
  `assets/Daves Workbench.png` is 13.8MB (3574×2534). None of these can
  be imported as-is without materially bloating the production bundle —
  per CHG-002/CHG-008's precedent, each new image must be re-exported
  (via `sips` or similar) to a reasonable web dimension/format before
  being copied into `src/assets/home/`. No image-optimisation build
  dependency is being added; this is a one-time export step during
  implementation.
- Squeezing two images into the existing ~280px aside column means each
  ends up quite small (~130px wide) — needs a visual check that both
  photos still read clearly at that size, especially on mobile where the
  same column width applies.
- `Dave Launching Plane.png` is a wide (1906×876, ~2.18:1) photo; at full
  welcome-column width it needs a sensible `aspect-ratio`/`object-fit`
  treatment (mirroring CHG-002's banner pattern) so it doesn't distort or
  crop awkwardly across breakpoints.
- Editing `WeeklyUpdate.tsx`/`.css` touches a component also covered by
  the existing Home Page Weekly Update feature spec and its Content
  fast-path guarantee for weekly text edits — this change must not alter
  that guarantee (only the fixed image markup changes; the editable
  `body` text data flow is untouched).

## Out of scope

- No change to the scrollable weekly-update body text or its Markdown data
  source (`src/data/home-weekly-update.md`) — that remains a Content
  fast-path edit, unaffected by this change.
- No change to the "Watch / Read / Build" highlight cards or the Latest
  Videos section further down the page.
- No change to `.home-hero`'s or `.weekly-update`'s relative column widths
  or breakpoint behaviour beyond accommodating the new images' height.
- No image-optimisation/compression tooling added as a new dependency.
- No change to any other route.

## Documentation updates

- `_specs/features/home-weekly-update/spec.md` — FR-002, Data
  requirements, and Interfaces sections updated to describe the two
  side-by-side images in place of the single fixed thumbnail (done as
  part of `implement-change`, per `CLAUDE.md`'s Definition of done).
- `_specs/feature-index.md` — Home Page Weekly Update row's dependency
  notes updated if needed to reflect the new asset.
