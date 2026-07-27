# Plan: Home Page Weekly Update

## Existing components to reuse

- `.container` layout utility, `--space-*`, `--radius-card`, `--shadow-small`
  tokens from `src/styles/tokens.css`.
- Layout pattern precedent (not a shared component, just prior art): About
  page's `figure`/`figcaption` image treatment (CHG-008) for the fixed
  graphic's caption-less small-image styling.
- No existing component provides a scroll box — `WeeklyUpdate` is new,
  feature-local (per `_specs/architecture.md` §9 — promote later only if
  another page needs it).

## Files expected to change

- `src/features/home/HomePage.tsx` — wrap the existing hero `<section>`
  and the new `WeeklyUpdate` column in a two-column flex/grid row; hero
  keeps its content unchanged.
- `src/features/home/HomePage.css` — new `.home-hero-row` (two-column,
  stacks to one column ≤900px matching the existing highlights breakpoint).

## New files expected

- `src/features/home/components/WeeklyUpdate.tsx` — heading (H2), fixed
  small image (imported, non-empty alt), fixed-height scrollable body-text
  box (`tabIndex={0}`, `role="region"`, `aria-label` referencing the
  heading so it's announced as a scrollable region).
- `src/features/home/components/WeeklyUpdate.css` — column width, image
  sizing, scroll box height/overflow, focus-visible outline.
- `src/data/home-weekly-update.ts` — `HomeWeeklyUpdate` interface +
  `homeWeeklyUpdate` const (`heading`, `body`), per spec's Data
  requirements. `body` seeded with the example update text supplied by the
  site owner (Canberra Bomber / Chaotic 3D flyer).
- `src/assets/home/foam-sheet-construction.jpg` — re-exported/resized copy
  of `assets/Foam Sheet Construction.jpg` (source is large; resize via
  `sips` to a small long-edge cap, matching the CHG-008 precedent, since
  it renders small in a narrow column).
- `src/features/home/components/WeeklyUpdate.test.tsx` — renders heading,
  image with alt text, scrollable region present and focusable.
- `src/features/home/HomePage.test.tsx` — confirms hero + `WeeklyUpdate`
  both render, existing highlights still render (regression).

## Data or API changes

None external. New local static data module only (§ above). No env vars,
no services.

## Tests to add or update

- `WeeklyUpdate.test.tsx` (new)
- `HomePage.test.tsx` (new — none existed before)
- Full existing suite must still pass unmodified (no other page touched).

## Dependencies

None new. Existing stack only (Preact, TypeScript, Vitest, Testing Library).

## Risks

- Source image weight: check actual file size/dimensions before deciding
  resize target (About-page precedent capped at 1400px long edge; this
  image needs to render much smaller, so a smaller cap, e.g. ~400px long
  edge, is more appropriate and keeps bundle weight negligible).
- Scroll-box fixed height is an implementation judgement call (spec Open
  Question 4) — pick a height that fits most of a ~100-word update without
  scrolling, verify visually in the browser preview at desktop/mobile.
- Two-column hero layout must not regress the existing hero's centered
  text treatment on its own when the column is empty/short — verify
  visually.

## Acceptance criteria mapping

- FR-001/FR-002/FR-003/FR-004 → `WeeklyUpdate.tsx` + `home-weekly-update.ts`
  + its test.
- FR-005 → satisfied by data module design itself (editing `body` alone is
  sufficient); documented, not separately tested.
- FR-006 (keyboard-operable scroll box) → `WeeklyUpdate.test.tsx`
  (focusable assertion) + manual keyboard verification in browser preview.
- Layout/responsive acceptance criteria → visual verification in browser
  preview at desktop/tablet/mobile widths.
- Accessibility (alt text, heading level, focus indicator) →
  `WeeklyUpdate.test.tsx` assertions + visual check of focus outline.
