# CHG-004 — Cap home banner height

## Status

Proposed

## Requested change

The Home page banner image (added in
[CHG-002](CHG-002-home-hero-imagery.md), made full-bleed in
[CHG-003](CHG-003-full-bleed-home-banner.md)) is too tall. Its height must
not exceed 25% of the available viewport height, at any viewport width.

Currently `.home-banner` has `width: 100%; aspect-ratio: 2048 / 480;` with
no height limit, so its rendered height is purely a function of viewport
*width* (≈23.4% of width). On typical wide/short desktop and laptop
viewports (e.g. 1280×900, 1600×900) this works out to roughly 33–42% of
viewport *height* — well past the requested 25% ceiling. On narrow/tall
mobile viewports (e.g. 390×844) the same math already lands under 25% of
height, so this change has little to no visible effect there.

Fix: cap the image's rendered height at 25% of viewport height
(`max-height: 25vh`) while keeping `width: 100%` and `object-fit: cover`,
so the crop shortens (still centred, no distortion) instead of the image
simply overflowing taller than the cap.

See the before/after mockup (16:10 viewport proportions, dashed line marks
the 25% threshold):
https://claude.ai/code/artifact/f35acff7-2acd-48a1-9e33-61e198d6f9d0

## Change classification

Design

## Affected files

- `src/features/home/HomePage.css` — add `max-height: 25vh` to
  `.home-banner` (alongside the existing `width: 100%`, `aspect-ratio`,
  `object-fit: cover`). No change to `HomePage.tsx` or any other file.
