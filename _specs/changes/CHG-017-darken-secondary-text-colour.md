# CHG-017 — Darken the secondary text colour

## Status

Implemented (2026-08-09)

## Requested change

Darken the site's secondary text colour (currently Sage Green, `#7C9A7D`)
site-wide — not just on the Home page welcome text added by CHG-016. The
site owner reviewed three shade options rendered in context (Home welcome
paragraph and a Card summary, on the real page background) and chose the
strongest option: `#435643`.

See the shade comparison (current vs. two darker options, in context):
https://claude.ai/code/artifact/8bd37804-fb48-4a28-bd69-10c762225bfb

## Reason

The site owner found the current pale green too light to read comfortably.
Checking it confirms a concrete accessibility problem, not just a
preference: `#7C9A7D` secondary text on the site's `#F8F6F2` (Warm Ivory)
background renders at **~2.9:1 contrast**, below the **4.5:1 minimum**
`_specs/design-system.md`'s Accessibility section requires ("Colour
contrast minimum AA"). The chosen replacement, `#435643`, renders at
**~7.3:1** — comfortably past AA and into AAA territory — while keeping the
same green hue, so it still reads as a distinct "secondary" tone next to
the Charcoal (`#2E2E2E`) primary text colour.

## Current behaviour

`src/styles/tokens.css` defines:

```css
--colour-text-secondary: #7c9a7d;
```

This single token is applied as `color: var(--colour-text-secondary)` in
six places across the site:

- `src/features/home/HomePage.css` — `.home-hero__lede` (the Home welcome
  paragraph/list added by CHG-016)
- `src/features/home/components/VideoCard.css` — `.video-card__date`
- `src/features/about/AboutPage.css` — inline-photo `figcaption`
- `src/features/three-d-designs/ThreeDDesignsPage.css` — figure
  `figcaption`
- `src/components/ui/Card.css` — `.card p` (shared `Card` component, used
  by the Home page's Watch/Read/Build highlights)
- `src/components/forms/FormField.css` — `.form-field__hint` (shared
  `FormField` component, used by the Suggestions page)

`_specs/design-system.md`'s Colour Palette section lists this colour under
"Secondary — Sage Green (#7C9A7D)", documented as used for "Secondary
text / Borders / Disabled controls". In the actual implementation only the
text usage is wired up: a separate, unused `--colour-secondary` token
exists in `tokens.css` with the same value, but no border or
disabled-control style in the codebase references either token — borders
use the distinct `--colour-border` (`#D8D5CD`). This change does not
touch that pre-existing spec/implementation gap (see Out of scope).

## Desired behaviour

- `--colour-text-secondary` in `src/styles/tokens.css` changes from
  `#7c9a7d` to `#435643`.
- Every place listed under Current behaviour picks up the new colour
  automatically (they already reference the token, not a literal).
- `_specs/design-system.md`'s Colour Palette section is updated: the
  Secondary swatch's hex value becomes `#435643`, and a short note
  documents why (AA contrast).
- No component markup, class names, or layout changes anywhere — this is a
  single token value change plus its documentation.

## Change classification

Design

## Affected specification

`_specs/design-system.md` — Colour Palette section, "Secondary — Sage
Green" entry (hex value and usage note).

## Affected implementation areas

- `src/styles/tokens.css` — the `--colour-text-secondary` value.
- No changes to `HomePage.css`, `VideoCard.css`, `AboutPage.css`,
  `ThreeDDesignsPage.css`, `Card.css`, or `FormField.css` themselves — they
  already reference the shared token and need no edits, but all six are
  functionally affected (visually) by this change, per CLAUDE.md's "Affects
  a shared component" / "Affects more than one component" thresholds.

## Requirements

1. `--colour-text-secondary` is the only token value changed, from
   `#7c9a7d` to `#435643`.
2. No other token in `tokens.css` (including the unused `--colour-secondary`
   — see Out of scope) is modified.
3. Contrast of the new value against `--colour-background` (`#F8F6F2`,
   Warm Ivory) and `--colour-surface` (`#FFFFFF`) both meet WCAG AA
   (≥4.5:1) for normal-size text.
4. `_specs/design-system.md`'s Secondary colour entry reflects the new hex
   value and the AA-contrast reason for the change.
5. No markup, class, or component-structure changes anywhere in the six
   affected files.

## Acceptance criteria

- [x] `src/styles/tokens.css`'s `--colour-text-secondary` is `#435643`.
- [x] The Home welcome paragraph/list, Card summaries (Watch/Read/Build
      highlights), video publish dates, About/3D Designs figure captions,
      and the Suggestions form's field hint text all render in the new
      darker green — verified visually in a real browser across all five
      affected pages (Home, About, 3D Designs, Videos, Suggestions).
- [x] Computed contrast of `#435643` against both `#F8F6F2` and `#FFFFFF`
      is ≥4.5:1.
- [x] `_specs/design-system.md`'s Secondary colour entry shows `#435643`.
- [x] `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
      build` all pass.
- [x] Existing tests that assert on secondary-text-bearing elements (e.g.
      any snapshot or colour-adjacent assertions, if present) still pass —
      expected to be none, since no existing test asserts on colour
      values, only presence/content of text.

## Regression risks

- **Site-wide visual impact**: because `--colour-text-secondary` is a
  shared token, every page that uses it changes appearance in the same
  commit (Home, About, 3D Designs, Videos' video cards, Suggestions'
  form). This is the intended effect of fixing a shared token, but it
  means a single visual review pass needs to cover all five pages, not
  just the Home page this request started from.
- **Contrast with borders/dividers**: `#435643` is noticeably darker/more
  saturated than the current pale sage. Worth a visual check that it
  doesn't clash with nearby `--colour-border` (`#D8D5CD`) hairlines or
  read as too close in weight to primary body text (`#2E2E2E`) at a
  glance — the ~7.3:1 AAA contrast means it's dark, though still
  measurably lighter/greener than the near-black primary text colour.
- Low functional risk otherwise: single CSS custom-property value, no
  logic, markup, or test-selector changes.

## Out of scope

- The unused `--colour-secondary` token in `tokens.css` (same current
  value, referenced by no component) — left as-is; not part of this
  request and not visibly wired to anything.
- Reconciling `_specs/design-system.md`'s "Borders / Disabled controls"
  usage note for the Secondary colour against the fact that no border or
  disabled-control style in the codebase actually uses it (`--colour-border`
  is a separate, already-distinct token) — a pre-existing spec/
  implementation gap, not introduced or worsened by this change.
- Any other colour token (Primary, Brand Accent, Accent, Highlight,
  Background, Text, Success, Warning, Error) — unchanged.
- Any component markup, layout, or behavioural change.

## Documentation updates

- `_specs/design-system.md` — Secondary colour entry's hex value and usage
  note updated (done as part of `implement-change`, per `CLAUDE.md`'s
  Definition of done).
- `_specs/feature-index.md` — Home Page Weekly Update's implementation
  summary (most recently touched by CHG-016) gets a short follow-up note
  that the welcome text's colour was subsequently darkened by this change,
  for continuity of the narrative; no dependency-column change needed.
