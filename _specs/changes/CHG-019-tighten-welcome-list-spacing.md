# CHG-019 — Tighten spacing in the welcome bullet list

## Status

Implemented (2026-08-09)

## Requested change

On the Home page, tighten the vertical spacing within the welcome block
from "On this site you'll find:" down through the four bullets to
"Enjoy!" — the gap before that block (between the intro paragraph, "Thanks
for dropping by…", and "On this site you'll find:") is unchanged. Shrinking
this block also moves the Dave Launching Plane photo below it up, since it
immediately follows in normal document flow.

The site owner reviewed two real-render passes before settling on the
tightest one:

- Rejected — paragraph/list/closing-line gap 16px→8px, bullet-to-bullet
  8px→4px.
- **Chosen** — paragraph/list/closing-line gap 16px→4px, bullet-to-bullet
  8px→4px (all gaps in the block equal, at 4px — the smallest step on
  `_specs/design-system.md`'s 8-point spacing scale, so still an allowed
  token value, not an arbitrary one).

See the chosen pass rendered (before/after): 
https://claude.ai/code/artifact/968e1f39-98a0-4724-ad1c-8a45c700c4d8

Implementation:

- `src/features/home/HomePage.tsx` — wrap the "On this site you'll find:"
  paragraph, the `<ul>`, and the "Enjoy!" paragraph in a new
  `<div className="home-hero__list-block">`, nested inside the existing
  `.home-hero__lede`. The intro paragraph stays a direct, unwrapped child
  of `.home-hero__lede`, so `.home-hero__lede`'s existing
  `gap: var(--space-16)` still applies once, between the intro paragraph
  and this new wrapper — unchanged.
- `src/features/home/HomePage.css` — add `.home-hero__list-block { display:
  flex; flex-direction: column; gap: var(--space-4); }`, and change the
  existing `.home-hero__lede ul`'s `gap` from `var(--space-8)` to
  `var(--space-4)`.
- No change to `.home-hero__image`'s own `margin-top` (`var(--space-32)`)
  — it moves up purely because the content above it is shorter, not
  because its own spacing changed.

## Change classification

Design

## Affected files

- `src/features/home/HomePage.tsx` — new `.home-hero__list-block` wrapper
  around the three existing elements (paragraph, `<ul>`, paragraph); no
  text content changes.
- `src/features/home/HomePage.css` — new `.home-hero__list-block` rule;
  `.home-hero__lede ul`'s `gap` reduced from `var(--space-8)` to
  `var(--space-4)`.
- No change to `WeeklyUpdate.tsx`/`.css`, other components, or any other
  page.
- No existing test asserts on spacing/gap values or on the DOM structure
  inside `.home-hero__lede` (existing assertions target text content and
  the image's alt text only), so no test file changes are expected;
  confirm this holds during `implement-change`.
- `_specs/feature-index.md` — Home Page Weekly Update's implementation
  summary (most recently touched by CHG-016/017/018) gets a short
  follow-up note once implemented, per `CLAUDE.md`'s Definition of done.
