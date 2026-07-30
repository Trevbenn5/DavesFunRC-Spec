# CHG-014 — 3D Designs page text introduction

## Status

Implemented (2026-07-30)

## Requested change

Replace the 3D Designs page's placeholder copy with a real text
introduction — the "3D Printer to Replace Foam Build" photo, and links to
the site owner's Cults3D and Ko-fi pages where visitors can download
.STL files.

## Reason

`src/features/three-d-designs/ThreeDDesignsPage.tsx` currently renders the
shared `PlaceholderPage` component with "Links to Cults3D, Ko-Fi and
Tinkercad designs are coming soon." The site owner supplied real copy and
wants the page to actually deliver on `_specs/product.md`'s "3D Designs:
Links to my Cults3D, Ko-Fi sites and FreeCAD" route description.

## Current behaviour

`ThreeDDesignsPage.tsx` renders `PlaceholderPage` (`title="3D Designs"`,
a single description string), the same shared component still used by
`SuggestionsPage`, `NotFoundPage`, and the error boundary (the About page
moved off it in `CHG-007`). No image, no outbound links, no page-local
styling exists for this route today.

## Desired behaviour

`ThreeDDesignsPage.tsx` stops using `PlaceholderPage` (same precedent as
`CHG-007`'s `AboutPage` change — `PlaceholderPage` itself is not modified,
so its three other consumers are unaffected) and renders its own content
directly inside the shared `.container` page shell:

- `<h1>3D Designs</h1>`.
- An intro block pairing the `3D Printer to Replace Foam Build.jpg` photo
  with three paragraphs of copy, side by side on desktop and stacked
  (image above text) on narrow screens — mirroring the responsive
  pattern already used by the About page's portrait/intro row.
- The introduction copy, verbatim, as three paragraphs:

  > Welcome! Here you'll find links to sites where you can download the
  > 3D printable .STL files for many of my RC designs. Each project
  > includes build instructions and links to the materials you'll need to
  > get started.
  >
  > Many of the designs are free to download, while some of my original
  > creations are available for about the price of a cup of coffee. Those
  > purchases help support the many hours of designing, testing, and
  > refining that go into creating these models and allow me to keep
  > developing new projects for the RC community.
  >
  > I hope you enjoy building them as much as I've enjoyed designing them.
  > Happy printing and happy flying!

- Two outbound links directly below the copy, reusing the existing
  `Button` component (`variant="secondary"`, matching the "Visit the
  YouTube channel" treatment used elsewhere): "View my designs on
  Cults3D" → `siteConfig.externalLinks.cults3d`, and "Support me on
  Ko-fi" → `siteConfig.externalLinks.koFi`. Both fields already exist in
  `src/app/app-config.ts` (added during scaffolding, unused until now) —
  no new config needed. Both open in a new tab via `Button`'s existing
  external-link handling.

Mockup (desktop + mobile, using the real photo and the exact copy above):
https://claude.ai/code/artifact/322be27a-a843-497c-bd18-00cc5f2eb764

## Change classification

Design

## Affected specification

None. No feature specification exists for the 3D Designs page (same
situation as the About page prior to `CHG-007` — built during scaffolding,
`_specs/product.md`'s entry is a one-line route description with no
detail to reconcile).

## Affected implementation areas

- `src/features/three-d-designs/ThreeDDesignsPage.tsx` — rewritten to
  render its own content (heading, intro image + copy, link buttons)
  instead of delegating to `PlaceholderPage`.
- New file `src/features/three-d-designs/ThreeDDesignsPage.css` —
  page-local styles for the intro row (flex layout, image sizing,
  responsive stacking) and the button row, using only existing
  `--space-*`/`--radius-*`/`--shadow-*` tokens — same approach as
  `AboutPage.css`.
- New file under `src/assets/three-d-designs/`: a re-exported copy of
  `assets/3D Printer to Replace Foam Build.jpg` (see Regression risks —
  the source is a 2.9MB, 3024×4032 phone photo and needs the same
  size/format export pass `CHG-008` did for the About page photos).
- New file `src/features/three-d-designs/ThreeDDesignsPage.test.tsx` —
  regression tests for the heading, all three paragraphs, image alt text,
  and both outbound links (href + accessible name).
- No changes to `PlaceholderPage.tsx`/`.css`, `src/app/app-config.ts`
  (both `externalLinks.cults3d` and `.koFi` already exist), routing, or
  any other page.

## Requirements

1. All three paragraphs render in order, unedited, each as its own `<p>`
   (not line breaks inside one block).
2. Heading hierarchy stays a single `<h1>3D Designs</h1>` — no new
   `<h2>`/`<h3>` sections.
3. The photo has descriptive, non-empty `alt` text (it's informative
   content, not decorative, per `_specs/architecture.md` §22).
4. Both link buttons reuse the existing `Button` component and
   `siteConfig.externalLinks` values — no new external-link handling
   logic, no hard-coded URLs in the component.
5. Layout stays within the existing 1200px `.container`, is free of
   horizontal overflow, and the image stacks above the text below the
   site's existing 900px breakpoint (matching `VideosPage.css`/
   `HomePage.css`'s established breakpoint).
6. Only existing typography/spacing/colour tokens are used — no new
   design-system values.
7. `PlaceholderPage.tsx` and its other consumers (`SuggestionsPage`,
   `NotFoundPage`, error boundary) are untouched and continue to render
   exactly as before.
8. The source photo is re-exported at a reasonable web size/format before
   being imported from `src/assets/three-d-designs/` (see Regression
   risks) — imported via Vite's asset pipeline, not referenced from
   `public/`.

## Acceptance criteria

- Given a visitor loads `/3d-designs`, when the page renders, then the H1
  "3D Designs" is followed by the photo and the three paragraphs above,
  in order, with no placeholder text remaining.
- Given the intro block, when a visitor activates "View my designs on
  Cults3D", then `siteConfig.externalLinks.cults3d` opens in a new tab;
  activating "Support me on Ko-fi" opens `siteConfig.externalLinks.koFi`
  in a new tab.
- Given a screen-reader user, when the photo is reached, then its `alt`
  text describes the image content.
- Page is visually consistent with the rest of the site (spacing, type,
  colour) at desktop (~1280px) and mobile (~390px) widths, with no
  horizontal overflow, and the image stacks above the text on narrow
  screens.
- `SuggestionsPage`, `NotFoundPage`, and the error-boundary fallback are
  visually unchanged (`PlaceholderPage.tsx`/`.css` not modified).
- `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
  build` all pass, and the production build fingerprints the re-exported
  photo under `dist/assets/`.

## Regression risks

- Low. The change is isolated to one feature's files plus one new asset;
  no shared component, route, or navigation entry is touched, and no
  existing test asserts on the current placeholder text.
- **Asset weight**: the source photo (`assets/3D Printer to Replace Foam
  Build.jpg`) is 2.9MB at 3024×4032 (full iPhone resolution, portrait).
  Per `_specs/architecture.md` §23 and the identical tradeoff flagged in
  `CHG-008`, it must be re-exported at a capped long-edge dimension
  (e.g. via `sips`, matching `CHG-008`'s ~1400px precedent) before being
  imported — otherwise this one image alone would add several MB to the
  production bundle. This is a one-time export step during
  implementation, not a new build dependency.
- A portrait (3:4) photo next to three paragraphs of body text is a new
  layout shape for this site (About's inline photos are full-width
  below/between text, not side-by-side) — worth a visual check at
  in-between tablet widths (~768px) in addition to the two breakpoints
  named above, to confirm the text column doesn't get too narrow before
  the 900px stack point.

## Out of scope

- The Tinkercad link mentioned in `_specs/product.md` and the old
  placeholder text — not requested, not added. `siteConfig.externalLinks.
  tinkercad` already exists but is out of scope for this change.
- Any per-design/per-model listing, gallery, or catalogue of individual
  3D designs — this is a single intro block with two outbound links, not
  a browsable directory.
- Any change to `PlaceholderPage` or its other consumers, routing,
  navigation, or any other page.
- Any change to `src/app/app-config.ts` — both required `externalLinks`
  values already exist.

## Documentation updates

None required beyond this spec and the `change-index.md` entry — no
feature specification exists to update, and (per `CHG-007`'s precedent)
`implement-change` doesn't touch `_specs/feature-index.md` for pages that
aren't tracked features there.
