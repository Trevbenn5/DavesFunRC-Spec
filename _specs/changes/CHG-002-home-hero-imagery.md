# CHG-002 — Home hero imagery

## Status

Implemented (2026-07-24)

## Requested change

Add imagery to the Home page to make it more engaging. The user pointed to
`assets/Banner.jpg` (the DavesFunRC YouTube channel banner) as a good
candidate image to use.

## Reason

The Home page currently has no imagery anywhere — just the hero heading,
lede paragraph and three text-only highlight cards. The site owner wants
it to feel less like a blank text page and more like the channel it
represents.

## Current behaviour

`src/features/home/HomePage.tsx` renders a `.home-hero` section containing
only an `<h1 className="brand-wordmark">` and a lede `<p>`, followed by a
`.home-highlights` grid of three `Card`s (Watch / Read / Build), which are
also text-only (`src/components/ui/Card.tsx` has no image slot). No image
asset is referenced anywhere in `src/`; `src/assets/` doesn't exist yet.

## Desired behaviour

- `assets/Banner.jpg` (2048×1152, Melbourne skyline with an RC plane, a
  drone, and a "DavesFunRC" wordmark baked into the photo) is added above
  the existing hero heading and lede, as a full-width, cropped banner
  strip — not behind or overlapping the text.
- The existing `<h1 className="brand-wordmark">G'day, welcome to
  DavesFunRC</h1>` and lede paragraph are unchanged: same text, same
  Kalam/Inter typography, same position in the DOM (now below the image
  instead of at the very top of the hero).
- This mirrors the layout the DavesFunRC YouTube channel page itself
  already uses (banner image, then the channel name as text directly
  below it) — see `assets/Screenshot YouTube Channel.png` for reference.
- Because the image already contains a "DavesFunRC" wordmark, it's treated
  as a decorative lead visual, not as informative content duplicating the
  heading: `alt=""` (empty alt), with the real heading remaining the
  screen-reader-visible page title.
- The three highlight cards (Watch / Read / Build) are unchanged — no
  image slot added to `Card` in this change (see Out of scope).

See the before/after mockup:
https://claude.ai/code/artifact/14277fa4-f5ed-4ee0-9c36-06a66962137c

## Change classification

Design

## Affected specification

None. No feature specification exists for the Home page (it was built
during scaffolding, not via `create-feature-spec`). `_specs/design-system.md`
doesn't currently document an asset-import convention or a hero-image
pattern — no existing spec content contradicts this change.

## Affected implementation areas

- `src/features/home/HomePage.tsx` — add an `<img>` above the existing
  `.home-hero` content, sourced from a new `src/assets/` copy of the
  banner.
- `src/features/home/HomePage.css` — style the new banner image
  (`width: 100%`, constrained `aspect-ratio`/`max-height`, `object-fit:
  cover`) and adjust `.home-hero` padding now that the image, not
  whitespace, leads the section.
- New file: `src/assets/home/banner.jpg` (or similar) — a copy of
  `assets/Banner.jpg`, per `_specs/architecture.md` §14 ("Assets imported
  by components should generally be stored under `src/assets/`... Vite
  should process imported assets so that production filenames and
  cache-busting are handled automatically"). This is the first image asset
  in the project, so it establishes that convention in practice.
- No changes to `Card`, `Button`, or any other shared component.
- No changes to routing, navigation, or any other page.

## Requirements

1. The banner image is imported from `src/assets/` (not referenced via a
   `public/` root-relative path), so Vite fingerprints it for
   cache-busting and production builds per §14 of the architecture doc.
2. The image renders full-width within the existing `.container` max-width
   (1200px) constraint used by the rest of the hero section, at a
   letterboxed height (not the image's full native 2048×1152 aspect) so it
   reads as a banner strip, not a giant hero photo.
3. `alt=""` on the image (decorative — the baked-in wordmark duplicates
   the adjacent `<h1>`), so screen readers skip it and the real heading
   remains the announced page title.
4. Image renders correctly and remains legible/proportional at common
   breakpoints (desktop ~1280px, tablet ~768px, mobile ~390px) with no
   horizontal scrolling and no layout shift once loaded.
5. No change to the hero's existing heading text, lede text, or the three
   highlight cards below it.

## Acceptance criteria

- [x] Home page (`/`) shows the banner image above the "G'day, welcome to
      DavesFunRC" heading, at desktop, tablet and mobile widths, with no
      horizontal overflow.
- [x] The heading and lede text are pixel-identical to today (same copy,
      same font, same position relative to each other) — only their
      position relative to the top of the page changes (now below the
      image).
- [x] The image has `alt=""` and does not introduce a duplicate
      accessible-name announcement for "DavesFunRC".
- [x] The three highlight cards (Watch / Read / Build) are visually and
      functionally unchanged.
- [x] The production build (`npm run build`) fingerprints the image file
      under `dist/assets/` (confirms it was imported via `src/assets/`,
      not left unprocessed).
- [x] `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
      build` all pass.
- [x] Existing tests in `tests/unit/App.test.tsx` continue to pass
      unmodified (they assert on the H1 text, which is unchanged).

## Regression risks

- `assets/Banner.jpg` is 432KB as a source file. Vite doesn't compress
  JPEGs by default (no image-optimisation plugin is installed), so the
  production bundle gains a same-sized asset. This is one image on one
  page, so it's judged acceptable without adding a new build dependency,
  but should be flagged rather than silently accepted — see
  `_specs/architecture.md` §23 (Performance) and §29 (a new dependency
  needs justification).
- Cropping a 2048×1152 source down to a shorter banner strip risks cutting
  off the plane/drone illustrations or the wordmark text depending on
  `object-position`; needs a visual check across breakpoints, not just a
  desktop screenshot.
- This is the first image asset in the project — the `src/assets/`
  convention and import pattern established here will likely be copied by
  future features, so getting the pattern right (vs. reaching for
  `public/`) matters beyond just this one image.

## Out of scope

- No image slot added to the shared `Card` component or to the Watch /
  Read / Build cards — the other available thumbnails in `assets/` all
  have their own baked-in captions (e.g. `Chaotic_Thumbnail 2.jpg`'s
  "CHAOTIX 3D FLYER — Can I control it?") that would need individual
  cropping/selection decisions per card. That's a reasonable follow-up
  change, not part of this one.
- No new "About"/mascot imagery (the koala mascot mentioned in
  `_specs/design-system.md` is scoped to the About page, not Home).
- No change to any other route.
- No image-optimisation/compression tooling added as a new dependency.

## Documentation updates

- `_specs/scaffold-status.md`'s "Design system locations" section should
  be updated by `implement-change` to note the new `src/assets/`
  directory and its convention, once implemented.
