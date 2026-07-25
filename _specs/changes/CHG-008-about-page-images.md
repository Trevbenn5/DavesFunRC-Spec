# CHG-008 — About page images

## Status

Implemented (2026-07-25)

## Requested change

Add three photos from `assets/` to the About page, woven into the existing
story text (added in CHG-007):

- `assets/Me Circle.png` — a circular headshot portrait of Dave.
- `assets/Slope Soaring 1.png` — Dave launching a slope-soaring glider from
  a coastal cliff.
- `assets/Backpack_Thumbnail DavesFunRC.jpg` — Dave riding a bike with a
  plane case on his back, with "PLANE ONBOARD!" and the DavesFunRC wordmark
  baked into the photo (originally a YouTube thumbnail).

## Reason

CHG-007 replaced the About page's placeholder with a full text-only story
per the site owner's request at the time. The site owner has now asked for
these three specific photos to be added to that page.

## Current behaviour

`src/features/about/AboutPage.tsx` renders `<h1>About</h1>` followed by
twelve `<p>` paragraphs from a `storyParagraphs` array — text only, no
images. `src/features/about/AboutPage.css` only sets page-level spacing
(`padding-block`, a `gap` between children).

## Desired behaviour

- **Portrait** (`Me Circle.png`) sits beside the opening line ("This site
  is all about having fun with RC planes—without spending a fortune."), in
  a circular frame, author-photo style. On narrow screens it stacks above
  the text instead of squeezing side-by-side.
- **Slope soaring photo** sits inline, full-width within the page's
  existing `.container` (never full-bleed, unlike the Home hero banner
  from CHG-002/CHG-003), directly after the "It definitely was." paragraph
  — the point in the story where the flying spark returns.
- **Backpack photo** sits inline, same treatment, directly after the
  "Flying at local clubs has introduced me to a great community..."
  paragraph — pairing the literal "budget-friendly and portable" image
  with the philosophy/community section of the text.
- All three images get real, descriptive `alt` text (not `alt=""`):
  unlike the Home banner (CHG-002), which was treated as decorative
  because its baked-in wordmark duplicated an adjacent heading, none of
  these three images duplicate adjacent text, so they're informative
  content per `_specs/architecture.md` §22 (Accessibility). The backpack
  photo's baked-in "PLANE ONBOARD!" / "DavesFunRC" caption is described in
  the `alt` text rather than repeated as visible text elsewhere.
- The two inline (non-portrait) photos each get a short `<figcaption>`
  underneath, consistent with treating them as content images rather than
  decoration.

See the mockup (placement, sizing, and captions):
https://claude.ai/code/artifact/973142c6-c27f-4713-bb28-d9893653d3fc

## Change classification

Design

## Affected specification

None. No feature specification exists for the About page (see CHG-007).

## Affected implementation areas

- `src/features/about/AboutPage.tsx` — restructured to interleave the
  three `<img>`/`<figure>` elements at the three points in
  `storyParagraphs` described above, importing each image from
  `src/assets/about/`.
- `src/features/about/AboutPage.css` — new rules for the portrait
  (circular crop, fixed size, flex layout with the intro paragraph) and
  the two inline photos (centered, `max-height: 600px`, width scaled to
  fit — see implementation note below — caption styling), using only
  existing `--space-*`/`--radius-*`/`--shadow-*` tokens.

  **Implementation note**: the mockup's `object-fit: cover` + fixed
  `max-height: 480px` banner treatment (mirroring the Home hero pattern)
  was tried first but rejected after visual verification — at desktop
  width it center-cropped both inline photos so aggressively that the
  glider disappeared entirely from the slope-soaring photo and "PLANE
  ONBOARD!" was cropped out of the backpack photo, contradicting the
  `alt`/`figcaption` text describing content that was no longer visible.
  Both source photos are portrait/near-square, not wide banner shapes, so
  they're instead shown uncropped (`width: auto; max-width: 100%;
  max-height: 600px`), scaled down and centered — narrower than the full
  container on desktop, full container width on mobile, no cropping at
  any breakpoint.
- New files under `src/assets/about/`: copies of the three source images
  (`portrait.png`, `slope-soaring.jpg`, `backpack.jpg` or similar),
  following the `src/assets/<feature>/` convention established in CHG-002.
- No changes to `PlaceholderPage`, routing, navigation, or any other page.

## Requirements

1. All three images are imported from `src/assets/about/` (not referenced
   via a `public/` root-relative path), so Vite fingerprints them for
   cache-busting and production builds, per `_specs/architecture.md` §14.
2. Each image has non-empty, descriptive `alt` text per the Desired
   behaviour section above.
3. The two inline photos render within the existing 1200px `.container`
   max-width — never full-bleed — and stay legible/proportional with no
   horizontal overflow at desktop (~1280px), tablet (~768px), and mobile
   (~390px) widths. Each photo's full frame is visible, uncropped, at every
   breakpoint — no crop that cuts off the subject the `alt`/`figcaption`
   describes.
4. The portrait stacks above the intro paragraph on narrow screens rather
   than compressing the paragraph into a thin column.
5. All twelve story paragraphs from CHG-007 remain present, unedited, and
   in the same order — only images are inserted between/beside them.
6. No new colour, font, or spacing value outside
   `src/styles/tokens.css`/`typography.css`.

## Acceptance criteria

- [x] `/about` shows the portrait beside the opening paragraph, the slope
      soaring photo after "It definitely was.", and the backpack photo
      after the "local clubs" paragraph, matching the mockup's placement
      (sizing treatment revised per the implementation note above).
- [x] All three images have descriptive alt text (covered by new
      `AboutPage.test.tsx` assertions using `getByAltText`).
- [x] Page remains visually consistent with the rest of the site (spacing,
      type, colour) and free of horizontal overflow at desktop and mobile
      widths. Verified via Playwright screenshots against a production
      preview build (not committed) — both inline photos render fully
      uncropped at both breakpoints.
- [x] The production build (`npm run build`) fingerprints all three image
      files under `dist/assets/` (`portrait-*.png`, `slope-soaring-*.jpg`,
      `backpack-*.jpg`), confirming they were imported via `src/assets/`,
      not left unprocessed.
- [x] `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
      build` all pass.
- [x] Existing `AboutPage.test.tsx` assertions (heading, paragraph
      count/order, no placeholder text) continue to pass unmodified — the
      `<figure>` elements didn't require changes to the paragraph-query
      selectors.

## Regression risks

- **Asset weight**: source files are large — `Slope Soaring 1.png` is
  3.2MB (2004×1782, PNG despite being a photo) and
  `Backpack_Thumbnail DavesFunRC.jpg` is 1.2MB (1825×2318). Per
  `_specs/architecture.md` §23 (Performance) and the same tradeoff flagged
  in CHG-002, no image-optimisation plugin exists in this project, so
  these should be re-exported at reasonable web dimensions/format (e.g.
  the PNG re-saved as JPEG) before copying into `src/assets/about/` —
  otherwise the About page alone would add ~4.5MB to the production
  bundle. Compression happens as a one-time export step during
  implementation, not as a new build dependency.

  Done: re-exported via `sips` to a 1400px-long-edge cap — portrait stays
  the original PNG (221KB, already small, alpha-transparent circular
  crop preserved), slope-soaring became a JPEG (3.2MB → 236KB), backpack
  became a resized JPEG (1.2MB → 465KB). Total new asset weight ≈920KB,
  not ~4.5MB.
- Three images in one page is more visual weight than any other current
  page carries — worth a layout check at mobile widths to confirm spacing
  between photos and text doesn't feel cramped.
- The backpack photo's baked-in "PLANE ONBOARD!"/wordmark graphic text
  means it reads visually as a YouTube thumbnail rather than an About-page
  photo; this is a known tradeoff of using that specific asset (the site
  owner's explicit choice), not a defect to fix here.

## Out of scope

- No cropping/re-editing of the source images beyond format/dimension
  export for web performance (see Regression risks) — no removal of the
  baked-in "PLANE ONBOARD!" text from the backpack photo.
- No additional images beyond these three (e.g. the koala mascot mentioned
  in `_specs/design-system.md` is not part of this change).
- No change to `PlaceholderPage` or any other route.
- No image-optimisation/compression tooling added as a new dependency.

## Documentation updates

None required beyond this spec and the `change-index.md` entry — same as
CHG-007, no feature specification exists to update.
