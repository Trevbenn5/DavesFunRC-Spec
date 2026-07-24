# CHG-005 — Plane icon in header logo

## Status

Proposed

## Requested change

Incorporate the plane from `assets/Logo.png` — by itself, isolated from
its background — into the site's title logo in the top navigation bar,
alongside the existing "DavesFunRC" wordmark.

## Reason

The header logo is currently text-only. The site owner wants the plane
artwork worked into the actual logo mark shown in the nav bar, not just
used on the Home page banner.

## Current behaviour

`src/components/layout/SiteHeader.tsx` renders the logo as a single
`<a className="site-header__logo brand-wordmark">{siteConfig.name}</a>` —
plain text, no image, linking to `/`.

`assets/Logo.png` (474×326) is a plane illustration in the same style as
`assets/Banner.jpg`, but with an opaque sky/cloud background baked into
every pixel (confirmed: PNG is RGBA but fully opaque, `alpha extrema
(255, 255)` — there is no existing transparency to reuse). A first,
naive attempt to key out the background via border-flood-fill failed:
the plane's white/cream body is close enough in raw colour to bright
clouds that the fill leaked straight through the fuselage and wings,
destroying most of the plane.

A second approach worked cleanly: classified each pixel by
**blue-channel cast** (`B − R`) rather than raw colour distance — the sky
consistently reads bluer (`B − R` roughly +25 to +70 across samples) while
every part of the plane (cream/white body, orange stripes, dark
cockpit/prop) has `B − R` at or below ~0. Thresholding on `B − R > 12`,
median-filtering to clean speckling, dropping small disconnected
components, feathering the alpha edge, and cropping to the content
bounding box produced a clean, artefact-free cutout (verified visually
against both a checkerboard and a white background).

See the mockup, built from the actual processed cutout (not a
placeholder), showing the icon in the desktop and mobile header:
https://claude.ai/code/artifact/3269ca61-20cb-4c2c-8bd6-1d0fea629588

## Desired behaviour

- The header logo becomes an icon-plus-wordmark lockup: the isolated
  plane image, then "DavesFunRC", both inside the same `<a href="/">` so
  either half navigates home.
- The plane renders with a fully transparent background — no visible sky
  patch, box, or halo around it.
- The icon is sized relative to the wordmark's text (e.g. roughly 2× the
  text's line-height), so it scales sensibly with the existing text and
  doesn't dominate or shrink to illegibility on mobile.
- No change to the wordmark's text, font (Kalam via `.brand-wordmark`),
  colour, or link behaviour — this only adds the icon beside it.
- No change to the favicon, the Home page banner, or any other page.

## Change classification

Design

## Affected specification

None. No feature specification exists for the shared header
(`src/components/layout/SiteHeader.tsx` was built during scaffolding).
`_specs/design-system.md`'s existing "site logo / wordmark" rules (Kalam
font, Periwinkle colour, reserved for the logo/hero only) are followed,
not changed.

## Affected implementation areas

- New asset: a processed, transparent-background cutout of the plane
  (e.g. `src/assets/brand/plane-logo.png`), produced from
  `assets/Logo.png` using the blue-channel-cast method described above.
  This is a one-off asset-preparation step (a local script run once
  against the source PNG), not a build-time dependency or pipeline — no
  new package is added to `package.json`. The threshold/method is
  recorded here and in `_specs/scaffold-status.md` for reproducibility if
  `assets/Logo.png` is ever replaced.
- `src/components/layout/SiteHeader.tsx` — import the new image, add an
  `<img>` before the `{siteConfig.name}` text inside the existing
  `<a>`.
- `src/components/layout/SiteHeader.css` — lay out `.site-header__logo`
  as a flex row (icon + text, centred, small gap); size the image in `em`
  relative to the logo text so it tracks the existing `font-size:
  1.75rem`.
- No changes to `MainNavigation`, routing, the Home page, or any other
  component.

## Requirements

1. The plane icon has a fully transparent background (no visible sky
   remnant, box, or hard-edged halo at normal viewing size).
2. The icon is decorative: `alt=""`, so the link's accessible name stays
   "DavesFunRC" (carried by the visible text), not duplicated or
   overridden by the image.
3. Icon and text sit inside one `<a href="/">`, so clicking either
   navigates home — no separate click targets.
4. Icon height is set in `em` (relative to the logo text's `font-size`),
   not a fixed pixel value, so icon and text scale together.
5. `SiteHeader`'s `position: sticky`, its `flex-shrink: 0` (relied on by
   the CHG-001 sticky-footer layout), and `MainNavigation`'s dropdown
   positioning are all unaffected.
6. Image imported via `src/assets/` (not `public/`), consistent with the
   convention established in CHG-002, so Vite fingerprints it.

## Acceptance criteria

- [ ] The plane icon renders next to "DavesFunRC" in the header on
      desktop, tablet and mobile widths, with no visible background
      artifact around it.
- [ ] Clicking the icon and clicking the text both navigate to `/`.
- [ ] The link's accessible name (via `getByRole('link', { name:
      'DavesFunRC' })` or equivalent) remains exactly "DavesFunRC" — the
      decorative `alt=""` doesn't add to or replace it.
- [ ] `SiteHeader` remains sticky to the top of the viewport on scroll
      (regression check against CHG-001).
- [ ] The mobile hamburger menu still opens/closes and overlays content
      the same way as before, at the existing 768px breakpoint.
- [ ] No horizontal overflow at desktop (~1280px), tablet (~768px) or
      mobile (~390px) widths, and the logo + nav don't visibly crowd each
      other around the 768–900px range.
- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
      build` all pass.
- [ ] Existing tests in `tests/unit/App.test.tsx` continue to pass
      unmodified.

## Regression risks

- The cutout was produced with a heuristic tuned to this specific source
  image (sky consistently bluer than the plane). It is a one-off static
  asset, not an automated pipeline — if `assets/Logo.png` is ever
  replaced with different artwork, someone will need to redo an
  equivalent cutout by hand or script; this isn't reusable tooling.
- At small header-icon scale, the plane's finer details (cockpit window,
  propeller) are only a few pixels — needs a visual check that it still
  reads clearly as a plane rather than a blob at the chosen size, not
  just at the mockup's larger preview size.
- Adding an image widens the logo, which slightly reduces the space
  available to `MainNavigation` before it collapses to the hamburger
  menu at 768px — worth confirming nothing crowds or wraps awkwardly
  just above that breakpoint.

## Out of scope

- No change to `public/favicon.svg` (the separate abstract browser-tab
  mark) — stays as-is.
- No change to the Home page banner (CHG-002/CHG-003) or any other
  route.
- No new npm dependency or reusable image-processing tooling.

## Documentation updates

- `_specs/scaffold-status.md`'s "Design system locations" / "Shared
  layout locations" sections should be updated by `implement-change` to
  note the new `src/assets/brand/` asset, the header logo lockup, and
  the blue-channel-cast cutout method (for reproducibility), once
  implemented.
