# CHG-018 — Align the weekly-update photos with the welcome paragraph

## Status

Proposed

## Requested change

On the Home page's hero row, the "What's Dave working on this week?"
column currently sits vertically centred against the welcome column
(`.home-hero-row { align-items: center; }`), so the top of its two
workbench photos (added by CHG-016) doesn't line up with anything in the
welcome column. The site owner reviewed two real-browser renders and chose
top-aligning the photos with the welcome paragraph, not the heading:

- **Chosen** — top of the two photos lines up with the top of "Thanks for
  dropping by…" (the welcome paragraph, below the "G'day, welcome to
  DavesFunRC" heading).
- Rejected alternative — top of the photos lines up with the top of the
  "G'day, welcome to DavesFunRC" heading itself.

See both options as rendered (chosen option is "Option B"):
https://claude.ai/code/artifact/ef8a928e-ec50-48fb-8067-e9739099062e

Implementation, measured against the real rendered layout at the
desktop breakpoint (1280px, where the two-column row applies):

- `src/features/home/HomePage.css` — `.home-hero-row`'s `align-items`
  changes from `center` to `flex-start`, so the row's two flex children
  (`.home-hero` and `WeeklyUpdate`) start from the same top edge instead of
  being vertically centred against each other.
- `src/features/home/components/WeeklyUpdate.css` — `.weekly-update` gains
  `margin-top: calc(var(--space-64) + var(--space-8))` (72px, composed
  from existing spacing tokens per `_specs/design-system.md`'s 8-point
  spacing system — measured gap between the heading's top and the
  paragraph's top is ~73.6px at this breakpoint, close enough not to be
  visually noticeable). This pushes the whole aside column down so its
  first content (the photo row) starts level with the welcome paragraph
  rather than the heading.
- No change ≤900px: the row already stacks to a single column at that
  breakpoint (existing `flex-direction: column` override), where
  `align-items`/`margin-top` on a top-aligned single column have no visual
  effect — verify this remains true, not just assume it.

## Change classification

Design

## Affected files

- `src/features/home/HomePage.css` — `.home-hero-row`'s `align-items`
  (`center` → `flex-start`).
- `src/features/home/components/WeeklyUpdate.css` — new `margin-top` on
  `.weekly-update`.
- No component markup (`HomePage.tsx`, `WeeklyUpdate.tsx`) changes — this
  is CSS-only.
- No existing test asserts on layout/position, so no test file changes are
  expected; confirm this holds during `implement-change`.
- `_specs/feature-index.md` — Home Page Weekly Update's implementation
  summary (most recently touched by CHG-016/CHG-017) gets a short
  follow-up note once implemented, per `CLAUDE.md`'s Definition of done.
