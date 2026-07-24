# CHG-003 — Full-bleed home banner

## Status

Implemented (2026-07-24)

## Requested change

Extend the Home page banner image (added in
[CHG-002](CHG-002-home-hero-imagery.md)) across the entire width of the
screen, edge-to-edge, instead of staying inset to the same 1200px
`.container` the heading, lede and highlight cards use.

This supersedes CHG-002's requirement #2 ("The image renders full-width
within the existing `.container` max-width (1200px) constraint"), which
this change intentionally reverses. Everything else about the banner from
CHG-002 is unchanged: it stays above the existing hero heading/lede,
`alt=""` (decorative), same crop/aspect ratio, no change to the
heading/lede/cards.

See the before/after mockup:
https://claude.ai/code/artifact/81cc41b6-3b7f-42f2-8664-fa45618a6a45

## Change classification

Design

## Affected files

- `src/features/home/HomePage.tsx` — the `.home-banner-wrap` div currently
  also carries the `container` class (inset + max-width); it needs to
  break out of that constraint so the image spans the full viewport width
  while the heading/lede/cards sections below keep their own `container`
  class unchanged.
- `src/features/home/HomePage.css` — `.home-banner-wrap` / `.home-banner`
  need a full-bleed treatment (e.g. `width: 100vw` centered via a
  negative-margin/`left: 50%; margin-left: -50vw` breakout, or moving the
  image outside any `container`-classed wrapper). The image's
  `border-radius: var(--radius-card)` should be dropped for the full-bleed
  version — rounded corners read oddly flush against the viewport edge.
