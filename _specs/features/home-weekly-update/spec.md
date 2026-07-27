# Feature: Home Page Weekly Update

## Purpose

Give visitors a quick, informal sense of what Dave is currently building or
flying, right on the Home page, without them having to check YouTube for a
new video. This supports `_specs/product.md`'s "keep users informed of
future planned projects" purpose and its "low-key, friendly, informal" tone.

Just as important as the on-page behaviour: the site owner (Dave) must be
able to update this text himself, frequently (weekly), by editing a plain
data file directly — not by going through `create-change-spec` each time.

## Scope

- A new narrow column, positioned to the right-hand side of the Home page
  (a sidebar, not a full-width section) — see Layout under User experience.
- The column contains, top to bottom:
  - A fixed heading: "What's Dave working on this week?"
  - A small, fixed graphic/image (`assets/Foam Sheet Construction.jpg`),
    displayed outside/above the scrolling area — it does not change week
    to week (see Open questions, resolved).
  - Below the graphic, a fixed-height box with its own internal vertical
    scroll containing the body text (guideline: under 100 words — see
    Non-functional requirements).
- The heading and body text are sourced from one plain data file under
  `src/data/`, imported by the Home page — not hardcoded inline in the
  component's JSX. The image is a fixed asset import (see Data
  requirements) since it does not rotate weekly.
- Documenting, in this spec and in `CLAUDE.md` terms, that routine edits to
  this data file's body text qualify for the existing **Content fast
  path** (`_specs/content-log.md`, no `CHG-*` spec) — this is what
  satisfies "editable without a change request".

## Out of scope

- No CMS, admin UI, or in-browser editing interface. Editing means a
  developer/owner edits a source file and rebuilds/redeploys — consistent
  with this being a static GitHub Pages site (`_specs/architecture.md` §2).
- No history/archive of past weekly updates — only the current one is
  shown. (Multiple past entries would be a data-structure change, not a
  content edit — out of scope here; could be a future feature.)
- No automated word-count enforcement or validation in code. "Under 100
  words" is an editorial guideline for whoever edits the data file, not a
  runtime rule.
- No changes to the Videos, 3D Designs, Suggestions, or About pages.
- No new npm dependency.

## User stories

- As a site visitor, I want to see what Dave is currently working on when I
  land on the Home page, so I feel like the site (and channel) is active
  and I know what to look out for on YouTube.
- As Dave (site owner), I want to update this week's text myself by
  editing one simple file, without writing a change specification each
  time, so that keeping it current isn't a chore.

## User experience

- The column appears on the Home page for every visitor, no required
  interaction for the page overall (no tabs, no dismiss, no loading state
  — content is static at build time, same as the rest of the Home page).
  The one interactive element is the internal scroll area itself (see
  Layout), which is scrollable by mouse, touch, or keyboard.
- **Layout**:
  - Positioned as a narrow right-hand column, alongside the Home page's
    main content — default assumption: beside the hero section (§Open
    questions), stacking full-width below the hero on tablet/mobile per
    the design system's single-column mobile grid.
  - Top to bottom within the column: heading (H2, always visible, not
    part of the scroll area) → small fixed graphic (always visible, not
    part of the scroll area, kept visually small per the request) → a
    fixed-height box below/around the body text with `overflow-y: auto`,
    so long text scrolls internally within its own box rather than
    pushing the rest of the page down.
  - If the body text is short enough to fit without scrolling, the box
    simply shows no scrollbar — no minimum content requirement.
  - The scroll box must be keyboard-operable (reachable via Tab, scrollable
    with arrow keys once focused) per `_specs/architecture.md` §22
    (Accessibility) — not a mouse/touch-only interaction.
- No empty state is needed in normal operation — the data file always has
  a value once this feature ships. If the site owner ever leaves the body
  text blank, the column should not render a broken/empty scroll box; see
  Edge cases.

## Functional requirements

- FR-001: The Home page displays a narrow right-hand column with the fixed
  heading "What's Dave working on this week?" (H2, per the heading
  hierarchy in `_specs/design-system.md`, since H1 is the existing hero
  heading).
- FR-002: The column displays one small, fixed image,
  `assets/Foam Sheet Construction.jpg` (copied into `src/assets/home/` per
  the existing `src/assets/<feature>/` convention), positioned outside/
  above the scrolling body-text area. This image does not need to be
  editable data — it is a fixed asset import in the component, since it
  does not change week to week.
- FR-003: Below the heading and image, the column displays a fixed-height
  box with internal vertical scrolling (`overflow-y: auto`) containing the
  body text (one or more paragraphs), sourced from the data file.
- FR-004: The heading and body text are each a separate field in one typed
  data module under `src/data/` (e.g. `src/data/home-weekly-update.ts`),
  imported by `HomePage.tsx` — not inlined in the component.
- FR-005: Updating the body text value requires editing only that data
  file — no change to component logic, image, routing, or other pages.
  (Separately, per `CLAUDE.md`'s existing Content fast path, swapping the
  image file itself remains possible as a "replacing an image" content
  edit if ever needed — but this is not an expected weekly action.)
- FR-006: The scroll box is reachable and operable via keyboard alone
  (e.g. a focusable container scrollable with arrow keys, or native
  scrollable-region semantics), not dependent on mouse or touch.

## Non-functional requirements

- Accessibility: image has descriptive, non-empty `alt` text (it's
  informative content, not decorative, per `_specs/architecture.md` §22 —
  same reasoning as CHG-008's About page photos). Heading uses correct
  level (H2, not skipping from the page's H1). Sufficient colour contrast
  using existing tokens only. The internal scroll box is keyboard-focusable
  and scrollable (see FR-006), with a visible focus indicator per the
  design system's Accessibility section.
- Performance: image is imported from `src/assets/home/` (Vite-processed,
  fingerprinted), not `public/`, kept small (both in display size and file
  weight) since it renders at a small fixed size in a narrow column.
- Editorial guideline (not enforced in code): body text should stay under
  ~100 words so the box rarely needs much internal scrolling, per the
  design system's "Cards... avoid large walls of text" and "spacious
  rather than cluttered" principles.
- Content-editability: per Scope, future edits to the body text must be
  classifiable as Content fast-path edits under `CLAUDE.md`'s Change
  specification thresholds (i.e. this feature must not require the data
  file's *structure* to change for an ordinary weekly text update — only
  its `body` value).

## Data requirements

The edited source of truth is a Markdown file, `src/data/home-weekly-update.md`
(see [CHG-010](../../changes/CHG-010-weekly-update-markdown-source.md)):

```md
# What's Dave working on this week?

First paragraph...

Second paragraph...
```

Convention: the first line is a single `#` (H1) heading; every remaining
blank-line-separated block becomes one body paragraph, in order. No other
Markdown syntax is rendered — the body displays as plain text, same as
before.

`src/data/home-weekly-update.ts` is a small loader/parser, not a literal:
it imports the `.md` file's raw text via Vite's built-in `?raw` import
suffix (no new dependency — `_specs/architecture.md` §17 already lists
"Markdown processed at build time" as an approved static content form)
and parses it into the same typed shape:

```ts
export interface HomeWeeklyUpdate {
  heading: string;
  body: string[]; // one entry per paragraph; editorial guideline: <100 words total
}

export const homeWeeklyUpdate: HomeWeeklyUpdate = parseWeeklyUpdate(rawContent);
```

`WeeklyUpdate.tsx` still imports `homeWeeklyUpdate` from
`src/data/home-weekly-update` unchanged — only the underlying source
(Markdown file instead of a TS literal) changed.

The image is not part of this data record — it's a fixed asset imported
directly in the component (e.g. `WeeklyUpdate.tsx`), since it does not
rotate weekly (see Open questions, resolved). Its `alt` text is a plain
string constant alongside the import, not editable data.

No persistence beyond the source file — no backend, no database, no
external service, consistent with `_specs/architecture.md` §17 (Data
Architecture: static content and configuration may be stored in TypeScript
modules).

## Interfaces

- `src/features/home/HomePage.tsx` — add the new column, laid out beside
  the hero section (default placement assumption).
- New component: `src/features/home/components/WeeklyUpdate.tsx` +
  `WeeklyUpdate.css` — the markup (heading, fixed image, scroll box) and
  its layout/scroll CSS are non-trivial enough to warrant its own
  component rather than inlining in `HomePage.tsx`, per
  `_specs/architecture.md` §9.
- New data module: `src/data/home-weekly-update.ts`, parsing
  `src/data/home-weekly-update.md` (heading + body only — see Data
  requirements; format changed from a TS literal to Markdown by
  [CHG-010](../../changes/CHG-010-weekly-update-markdown-source.md)).
- New asset: `src/assets/home/foam-sheet-construction.jpg` (or similar),
  copied/re-exported from `assets/Foam Sheet Construction.jpg`, imported
  directly in `WeeklyUpdate.tsx`.

## Existing components to reuse

- Existing `.container` layout utility and `--space-*`/`--radius-*` tokens
  from `src/styles/tokens.css`.
- No use of `Card` (`src/components/ui/Card.tsx`) — Card is built for a
  title/summary/action link pattern (used by the existing highlights
  section); this is a single fixed graphic plus a scrolling text box, not
  a card grid. No existing component currently provides a scrollable text
  box, so `WeeklyUpdate` is new (see Interfaces).

## Expected changes

- `src/features/home/HomePage.tsx` — add the new column alongside the
  hero, adjusting the hero section's layout to accommodate a two-column
  arrangement on desktop (single column, stacked, on mobile/tablet).
- `src/features/home/HomePage.css` — layout rules for the new two-column
  arrangement.
- New: `src/features/home/components/WeeklyUpdate.tsx` +
  `WeeklyUpdate.css`.
- New: `src/data/home-weekly-update.ts`.
- New: `src/assets/home/foam-sheet-construction.jpg` (re-exported/resized
  from `assets/Foam Sheet Construction.jpg`).
- New/updated tests: `src/features/home/HomePage.test.tsx` and/or
  `WeeklyUpdate.test.tsx` (create if they don't exist yet, or extend).
- No routing, navigation, or shared-component changes.

## Constraints

- Must not introduce a CMS, admin route, authentication, or database —
  would require an architectural decision record per
  `_specs/architecture.md` §31 and is explicitly out of scope.
- Must follow `_specs/architecture.md` §14 (import images via
  `src/assets/`, not `public/`) and §22/§23 (accessibility, performance).
- Must not change `Card`, `PageLayout`, navigation, or any other page.

## Edge cases

- If the body text is ever left empty in the data file: render nothing in
  the scroll box (no broken empty paragraph), but still show heading and
  image, so a blank edit doesn't produce a visibly broken column. (Simple
  guard, not a full empty-state UI — there's no user-facing "no update
  yet" scenario expected in normal use.)
- Very long body text (someone ignores the ~100 word guideline): handled
  by the scroll box itself — text scrolls internally rather than growing
  the column or pushing page content down; this is the reason the box has
  a fixed height in the first place.
- Missing/broken image reference: this would be a TypeScript import error
  caught at build time (`npm run build` fails), not a runtime broken-image
  state, since the image is imported rather than referenced by string
  path.

## Acceptance criteria

- Given a visitor loads the Home page, when the page renders, then a
  narrow right-hand column is visible with the heading "What's Dave
  working on this week?", the fixed graphic (with alt text), and a
  fixed-height scroll box containing the configured body text.
- Given the site owner edits only the `body` string in
  `src/data/home-weekly-update.ts`, when the site is rebuilt, then the
  Home page reflects the new text with no other code change required.
- Given the body text is long enough to exceed the scroll box's fixed
  height, when the visitor scrolls within the box (mouse, touch, or
  keyboard), then the full text becomes readable without the rest of the
  page layout shifting.
- Given the page is viewed at desktop, tablet, and mobile widths, then the
  column remains legible with no horizontal overflow, and stacks
  full-width below the hero on narrower widths.
- Given a screen reader or keyboard-only user, when they reach the image,
  then they hear meaningful alt text (not empty/decorative alt); when they
  Tab to the scroll box, then it is focusable and scrollable with arrow
  keys.

## Open questions

1. **Placement**: default assumption above is that the column sits beside
   the hero section (visible without scrolling the main page, near the
   top). Confirm this is the intended position rather than, e.g., beside
   the "Watch / Read / Build" highlights further down.
2. ~~Does the image change every week, alongside the text?~~ **Resolved**:
   no — the photo stays fixed; only the `body` text is expected to change
   weekly (see Scope, Data requirements).
3. Should the heading ever change (e.g. "...this month?" instead of
   "...this week?"), or is it always fixed text? Default assumption: fixed,
   not part of the "editable" data the owner is expected to touch weekly.
4. **Scroll box fixed height**: no specific pixel/line-count value has
   been given. Default assumption for implementation: a height that
   comfortably shows most of a ~100-word update without scrolling (so
   scrolling is the exception, not the norm), using existing `--space-*`
   tokens — exact value to be finalised during implementation and visually
   verified in a real browser.

## Tests

- `WeeklyUpdate.test.tsx` (new): renders the heading, fixed image (with
  non-empty alt text), and body text from the data module; confirms the
  scroll container is present and keyboard-focusable.
- `HomePage.test.tsx` (new or extended): confirms the column renders
  beside the hero section; confirms existing hero and highlights content
  still renders (no regression).
- No service/hook tests needed — no async behaviour, no external service.

## Completion

`_specs/feature-index.md` updated with:

- Feature: Home Page Weekly Update
- Specification: `_specs/features/home-weekly-update/spec.md`
- Status: Specified
- Dependencies: None (no new env vars, no external service).
