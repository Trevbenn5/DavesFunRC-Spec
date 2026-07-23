# CHG-001 — Sticky footer layout

## Status

Proposed

## Requested change

Pin the site footer to the bottom of the viewport when page content is
shorter than the viewport, so it doesn't float mid-page with empty space
below it. When content is taller than the viewport, the footer must keep
scrolling with the content exactly as it does today — it must not become
`position: fixed` or otherwise overlay content.

This is the classic "sticky footer" layout pattern (footer pinned only when
content is short; normal document flow otherwise).

## Reason

Reported directly by the site owner while reviewing the scaffold: on
short-content pages (currently every page — `/`, `/videos`, `/3d-designs`,
`/suggestions`, `/about` are all placeholder-length), the footer sits right
after the content instead of at the bottom of the browser window, leaving
visible empty background beneath it.

## Current behaviour

`src/components/layout/PageLayout.tsx` renders `.page-layout` as a plain
block-level `<div>` containing `SiteHeader`, `<main>`, `SiteFooter`, with no
height or flex rules applied to it, `<body>`, or `<html>`
(`src/styles/global.css`). Page height is therefore just the sum of its
content — on any page shorter than the viewport, `SiteFooter` renders
directly below the content and the remaining viewport height below it is
empty `<body>` background, not the footer.

## Desired behaviour

- Short content: `SiteFooter` renders flush with the bottom of the viewport,
  with no empty gap below it, and no gap between content and footer beyond
  the existing `margin-top` spacing.
- Tall content: layout is pixel-identical to today — `SiteFooter` appears
  after the content in normal flow and scrolls with the page.
- No page needs to opt in or out; this is a layout-shell change, not a
  per-page one.
- `SiteHeader`'s existing `position: sticky; top: 0;` behaviour is
  unaffected.
- The mobile navigation dropdown (`MainNavigation`, `position: absolute`
  relative to `.site-header__inner`) is unaffected — it must still overlay
  page content the same way it does today, on both short and tall pages.

See the mockup for the two target states (short content / footer pinned,
vs. tall content / footer scrolls):
https://claude.ai/code/artifact/2228a5fe-8d2e-4761-b2bd-ba51cbb328c4

## Change classification

Design

## Affected specification

None. `_specs/design-system.md` doesn't specify footer viewport-pinning
behaviour either way; no spec document needs updating for this change.
`_specs/architecture.md` §15 (Styling Architecture) and §7 (Application
Shell) already cover where this code lives — no architectural change.

## Affected implementation areas

- `src/components/layout/PageLayout.tsx` — the `.page-layout` wrapper needs
  to become a min-height-100%-of-viewport flex column so `<main>` can absorb
  the slack.
- `src/styles/global.css` — `html`, `body` (and the `#app` root Preact
  renders into) need `height: 100%` so `.page-layout`'s percentage-based
  height rule has something to resolve against.
- `src/components/layout/SiteFooter.css` — no visual change to the footer
  itself; it keeps `margin-top: var(--space-64)` so short-page spacing above
  it is unchanged.
- No route/page component needs to change.

## Requirements

1. `html`, `body` get `height: 100%`; the element Preact renders into
   (`#app`) and `.page-layout` get `min-height: 100%` (or `100vh`,
   whichever composes correctly with `SiteHeader`'s `position: sticky`) and
   `display: flex; flex-direction: column`.
2. `<main id="main-content">` gets `flex: 1 0 auto` (or equivalent) so it —
   not the footer — absorbs any extra space on short pages.
3. `SiteFooter` and `SiteHeader` keep `flex-shrink: 0` (implicit or
   explicit) so they never get compressed.
4. No changes to `SiteFooter`'s internal padding, colours, or link layout.

## Acceptance criteria

- [ ] On a short-content page (e.g. `/videos` placeholder) at common
      viewport heights (e.g. 800px, 1024px desktop; 844px mobile), the
      footer's bottom edge is flush with the viewport's bottom edge and
      there is no visible empty background below it.
- [ ] On a page long enough to exceed the viewport (verify by temporarily
      viewing at a very short viewport height, e.g. 400px, against the
      current Home page content), the footer appears after the content in
      normal flow and the page scrolls to reveal it — it does not stay
      pinned/fixed while scrolling.
- [ ] `SiteHeader` remains sticky to the top of the viewport on scroll,
      unchanged from current behaviour.
- [ ] The mobile hamburger menu still opens as an overlay positioned under
      the header on both short and tall pages, unchanged from current
      behaviour.
- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
      build` all pass.
- [ ] Existing tests in `tests/unit/App.test.tsx` and
      `src/components/ui/Button.test.tsx` continue to pass unmodified.

## Regression risks

- Introducing `height: 100%` up the `html`/`body`/`#app` chain is a
  global-shell change that affects every current and future page — a
  mistake here (e.g. wrong flex-basis on `<main>`) would visibly break
  every route, not just one.
- Interaction with `SiteHeader`'s `position: sticky` and `MainNavigation`'s
  `position: absolute` dropdown: switching `.page-layout` to
  `display: flex; flex-direction: column` must not change the containing
  block those rely on (both are already scoped inside `SiteHeader`, not
  `.page-layout`, so this is expected to be unaffected, but must be
  verified visually per the acceptance criteria above).
- `100vh` on mobile browsers can be taller than the visible viewport
  because of collapsing address-bar chrome; prefer `min-height: 100%` on
  `#app`/`.page-layout` (resolved against `height: 100%` on `html`/`body`)
  over `100vh` directly, to avoid a gap re-appearing under the footer on
  mobile Safari/Chrome.

## Out of scope

- No change to footer content, links, or styling.
- No change to header behaviour.
- No change to any route/page content.
- No new dependency.

## Documentation updates

- `_specs/scaffold-status.md`'s "Shared layout locations" section should be
  updated by `implement-change` to note the sticky-footer flex layout, once
  implemented.
