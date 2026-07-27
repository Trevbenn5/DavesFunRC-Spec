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

- A new section on the Home page (`src/features/home/HomePage.tsx`),
  placed after the existing hero section and before (or after — see Open
  questions) the existing "Watch / Read / Build" highlights section.
- The section renders:
  - A fixed heading: "What's Dave working on this week?"
  - A single supporting graphic/image.
  - A short body of free text (guideline: under 100 words — see
    Non-functional requirements).
- The heading, image, and body text are all sourced from one plain data
  file under `src/data/`, imported by the Home page — not hardcoded inline
  in the component's JSX.
- Documenting, in this spec and in `CLAUDE.md` terms, that routine edits to
  this data file's body text (and swapping its image) qualify for the
  existing **Content fast path** (`_specs/content-log.md`, no `CHG-*`
  spec) — this is what satisfies "editable without a change request".

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
- As Dave (site owner), I want to update this week's text and photo myself
  by editing one simple file, without writing a change specification each
  time, so that keeping it current isn't a chore.

## User experience

- The section appears on the Home page for every visitor, no interaction
  required (no tabs, no dismiss, no loading state — content is static at
  build time, same as the rest of the Home page).
- Layout: heading, then image and body text arranged like the existing
  About page's inline photo-plus-text treatment (CHG-008) — image above or
  beside the text on desktop, stacked on mobile, full text still readable
  without the image (real `alt` text, not decorative).
- No empty state is needed in normal operation — the data file always has
  a value once this feature ships. If the site owner ever leaves the body
  text blank, the section should not render a broken/empty box; see Edge
  cases.

## Functional requirements

- FR-001: The Home page displays a section with the fixed heading "What's
  Dave working on this week?" (H2, per the heading hierarchy in
  `_specs/design-system.md`, since H1 is the existing hero heading).
- FR-002: The section displays one image, sourced from a single named
  import in the data file. The initial image is
  `assets/Foam Sheet Construction.jpg` (copied into `src/assets/home/`
  per the existing `src/assets/<feature>/` convention).
- FR-003: The section displays a body of free text, sourced from the data
  file, rendered as one or more paragraphs.
- FR-004: The heading, image (`src` + `alt`), and body text are each a
  separate field in one typed data module under `src/data/` (e.g.
  `src/data/home-weekly-update.ts`), imported by `HomePage.tsx` — not
  inlined in the component.
- FR-005: Updating the body text value, or swapping which image file the
  data module points to (with a new `alt` value), requires editing only
  that data file (plus, for an image swap, adding the new image under
  `src/assets/home/`) — no change to component logic, routing, or other
  pages.

## Non-functional requirements

- Accessibility: image has descriptive, non-empty `alt` text (it's
  informative content, not decorative, per `_specs/architecture.md` §22 —
  same reasoning as CHG-008's About page photos). Heading uses correct
  level (H2, not skipping from the page's H1). Sufficient colour contrast
  using existing tokens only.
- Performance: image is imported from `src/assets/home/` (Vite-processed,
  fingerprinted), not `public/`, and re-exported at a reasonable web size
  per the precedent set in CHG-008 (source `assets/` originals are large).
- Editorial guideline (not enforced in code): body text should stay under
  ~100 words so the section stays skimmable and doesn't dominate the Home
  page, per the design system's "Cards... avoid large walls of text" and
  "spacious rather than cluttered" principles.
- Content-editability: per Scope, future edits to the body text or image
  must be classifiable as Content fast-path edits under `CLAUDE.md`'s
  Change specification thresholds (i.e. this feature must not require the
  data file's *structure* to change for an ordinary weekly text/photo
  update — only its values).

## Data requirements

Single data module, e.g. `src/data/home-weekly-update.ts`:

```ts
export interface HomeWeeklyUpdate {
  heading: string;
  body: string; // one or more paragraphs; editorial guideline: <100 words
  image: {
    src: string; // imported from src/assets/home/
    alt: string;
  };
}

export const homeWeeklyUpdate: HomeWeeklyUpdate = {
  heading: "What's Dave working on this week?",
  body: '...',
  image: {
    src: foamSheetConstructionImage,
    alt: '...',
  },
};
```

No persistence beyond the source file — no backend, no database, no
external service, consistent with `_specs/architecture.md` §17 (Data
Architecture: static content and configuration may be stored in TypeScript
modules).

## Interfaces

- `src/features/home/HomePage.tsx` — add the new section, importing from
  the new data module.
- New data module: `src/data/home-weekly-update.ts`.
- New asset: `src/assets/home/foam-sheet-construction.jpg` (or similar),
  copied/re-exported from `assets/Foam Sheet Construction.jpg`.
- Possibly a small new presentational component (e.g.
  `src/features/home/components/WeeklyUpdate.tsx` +
  `.css`) if the markup is non-trivial enough to warrant separating from
  `HomePage.tsx` — decide during implementation based on actual markup
  size, per `_specs/architecture.md` §9 (feature-specific components stay
  under `src/features/` unless genuinely reusable).

## Existing components to reuse

- Existing `.container` layout utility and `--space-*`/`--radius-*` tokens
  from `src/styles/tokens.css`.
- Layout/treatment precedent from the About page's inline photo sections
  (CHG-008) — image + caption-style treatment, responsive stacking.
- No use of `Card` (`src/components/ui/Card.tsx`) — Card is built for a
  title/summary/action link pattern (used by the existing highlights
  section); this section is a single narrative text block plus image, not
  a card grid.

## Expected changes

- `src/features/home/HomePage.tsx` — add new section + import.
- `src/features/home/HomePage.css` — new rules for the section (or a new
  component-scoped CSS file if a subcomponent is created).
- New: `src/data/home-weekly-update.ts`.
- New: `src/assets/home/foam-sheet-construction.jpg` (re-exported/resized
  from `assets/Foam Sheet Construction.jpg`).
- New/updated tests: `src/features/home/HomePage.test.tsx` (create if it
  doesn't exist yet, or extend).
- No routing, navigation, or shared-component changes.

## Constraints

- Must not introduce a CMS, admin route, authentication, or database —
  would require an architectural decision record per
  `_specs/architecture.md` §31 and is explicitly out of scope.
- Must follow `_specs/architecture.md` §14 (import images via
  `src/assets/`, not `public/`) and §22/§23 (accessibility, performance).
- Must not change `Card`, `PageLayout`, navigation, or any other page.

## Edge cases

- If the body text is ever left empty in the data file: render nothing for
  the body (no broken paragraph), but still show heading + image, so a
  blank edit doesn't produce a visibly broken section. (Simple guard, not
  a full empty-state UI — there's no user-facing "no update yet" scenario
  expected in normal use.)
- Very long body text (someone ignores the ~100 word guideline): no
  truncation logic — text wraps naturally; this is an editorial concern,
  not a functional bug.
- Missing/broken image reference: this would be a TypeScript import error
  caught at build time (`npm run build` fails), not a runtime broken-image
  state, since the image is imported rather than referenced by string
  path.

## Acceptance criteria

- Given a visitor loads the Home page, when the page renders, then a
  section with the heading "What's Dave working on this week?", the
  configured image (with alt text), and the configured body text is
  visible, positioned after the hero section.
- Given the site owner edits only the `body` string (or swaps `image.src`
  and `image.alt`) in `src/data/home-weekly-update.ts`, when the site is
  rebuilt, then the Home page reflects the new text/image with no other
  code change required.
- Given the page is viewed at desktop, tablet, and mobile widths, then the
  section remains legible with no horizontal overflow and the image/text
  layout adapts responsively.
- Given a screen reader user, when they reach the image, then they hear
  meaningful alt text (not empty/decorative alt).

## Open questions

1. **Placement**: should this section sit between the hero and the
   "Watch / Read / Build" highlights, or after the highlights? (Default
   assumption above: immediately after the hero, since it's timely/newsy
   content the site owner likely wants near the top.)
2. **Does the image change every week, alongside the text?** The request
   names one specific image ("Foam Sheet Construction") for the current
   update. This spec treats the image as part of the same editable data
   record as the body text (so a future week showing a different project
   can swap both together) rather than a fixed, permanent graphic for the
   section. Confirm this is the intent before implementation.
3. Should the heading ever change (e.g. "...this month?" instead of
   "...this week?"), or is it always fixed text? Default assumption: fixed,
   not part of the "editable" data the owner is expected to touch weekly.

## Tests

- `HomePage.test.tsx` (new or extended): renders the heading, image (with
  non-empty alt text), and body text from the data module; confirms
  section appears after the hero section; confirms existing hero and
  highlights content still renders (no regression).
- No service/hook tests needed — no async behaviour, no external service.

## Completion

`_specs/feature-index.md` updated with:

- Feature: Home Page Weekly Update
- Specification: `_specs/features/home-weekly-update/spec.md`
- Status: Specified
- Dependencies: None (no new env vars, no external service).
