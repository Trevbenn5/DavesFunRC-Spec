# Feature: References Page

## Purpose

Visitors and Dave currently have no single place on the site for curated
external links — useful RC/flying sites, flying clubs, YouTube channels
and playlists outside DavesFunRC's own, forums, etc. This feature adds a
`References` page reachable from main navigation, and a build-time data
file Dave can edit directly (no code changes) to keep the list current.

## Scope

- A new route, `/references`, added to `src/app/routes.ts` between the
  existing `3D Designs` (`/3d-designs`) and `Suggestions` (`/suggestions`)
  entries, so it's picked up by `MainNavigation` automatically in that
  position.
- A new page (`src/features/references/ReferencesPage.tsx`) with:
  - An `<h1>` and a short intro paragraph.
  - The reference list grouped into categories (e.g. "Useful Sites",
    "Flying Clubs", "YouTube Channels"), each rendered as a labelled
    section with its links.
  - Each link shows a title (the link's accessible/visible name) and an
    optional short note, and opens the external URL in a new tab.
- A new data file, `src/data/references.md`, holding the actual category/
  link content as Markdown, editable directly by Dave with no code
  changes required.
- A new parser module, `src/data/references.ts`, that reads
  `references.md` via Vite's `?raw` import (same mechanism as
  `home-weekly-update.ts`) and exports a typed, structured list for the
  page to render.
- Empty-category and empty-list handling (see Edge cases).

## Out of scope

- Any admin UI, CMS, authentication, or in-browser editing of the
  reference list — edits happen by hand-editing `references.md` and
  rebuilding/redeploying, exactly like `home-weekly-update.md`.
- Validating that a given URL is reachable, well-formed beyond basic
  parsing, or safe (no link-checking, no preview scraping).
- Search, filtering, tagging, or sorting controls on the page — the order
  and grouping in `references.md` is the rendered order.
- Any change to `SiteHeader`, `SiteFooter`, or any other route.
- The separate "Melbourne-based flying clubs" informational content
  mentioned as its own core feature in `_specs/product.md` — this page
  may link to flying club websites as one of its categories, but does not
  attempt to fully replace or subsume a dedicated flying-clubs feature if
  one is built later.

## User stories

- As a visitor, I want a page of curated links (sites, clubs, YouTube
  channels) related to RC flying, grouped so I can quickly find the kind
  of resource I'm after.
- As Dave, I want to add, remove, or re-word a reference link by editing
  one plain-text file and rebuilding, without writing or reviewing any
  component code.

## User experience

Visiting `/references` shows a heading, a short intro paragraph, and one
section per category (each with its own heading), listing that
category's links. Each link is clickable text (the title), with an
optional short note beside or beneath it, and opens in a new tab since
it navigates away from the site. If `references.md` has no categories/
links at all, the page shows a designed empty state instead of a blank
section — the same pattern already used by the Read and Videos pages
when their data source is empty (see `_specs/features/how-to-articles/
spec.md`).

## Functional requirements

- FR-001: `src/app/routes.ts` gains a new entry — `{ path: '/references',
  label: 'References', Component: ReferencesPage, showInNav: true }` —
  positioned between the `3D Designs` and `Suggestions` entries, so it
  renders in that position in `MainNavigation` (which iterates `routes`
  in array order) and is reachable by direct navigation.
- FR-002: `src/data/references.md` holds the content, using this
  convention:
  ```markdown
  ## Category Name

  - [Link Title](https://example.com) — optional short note.
  - [Another Link](https://example.com)
  ```
  A category is a `##` heading line; each following `-` bullet until the
  next `##` (or end of file) is one link in that category. The note after
  an em dash (`—` or `--`/`-`) is optional — a bullet with no note is
  valid.
- FR-003: `src/data/references.ts` parses the raw Markdown into:
  ```ts
  export interface ReferenceLink {
    title: string;
    url: string;
    note?: string;
  }

  export interface ReferenceCategory {
    category: string;
    links: ReferenceLink[];
  }

  export function parseReferences(markdown: string): ReferenceCategory[];
  export const referenceCategories: ReferenceCategory[];
  ```
  mirroring `home-weekly-update.ts`'s exported-pure-function-plus-parsed-
  constant shape, so the parser is unit-testable independent of the
  `?raw` import.
- FR-004: `ReferencesPage.tsx` renders one section per parsed category
  (category name as an `<h2>`), each with its links as a list; malformed
  or unparseable individual bullets are skipped rather than crashing the
  page (see Edge cases).
- FR-005: Each rendered link is an external, new-tab link (reusing
  `components/ui/Button`'s existing external-link handling, or a plain
  `<a target="_blank" rel="noopener noreferrer">`, per whichever the
  chosen visual treatment needs — see Interfaces) with an accessible name
  that includes the link title (not just "click here" or a bare URL).
- FR-006: If `referenceCategories` is empty, or every category has zero
  links, the page renders a designed empty-state message instead of
  empty section headings.

## Non-functional requirements

- Accessibility: heading hierarchy starts at H1 (page) → H2 (category) →
  link text, no skipped levels; every link has a real accessible name
  (the link title, not "here"/bare URL); external-link behaviour (new
  tab) doesn't rely on colour alone to signal it — an icon or visible
  affordance is used, consistent with any existing new-tab link pattern
  on the site (e.g. `PlaylistCard`'s "View playlist" via `Button`); all
  content is reachable and operable by keyboard; sufficient colour
  contrast per `_specs/design-system.md`.
- Performance/dependencies: no new npm dependency, no new environment
  variable, no external service call — everything is a static Markdown
  file processed at build time, same mechanism as the existing weekly
  update.
- Maintainability: the Markdown convention in FR-002 must be simple
  enough that a mis-formatted line degrades gracefully (that bullet or
  category is skipped, not a build failure or a blank page) — see Edge
  cases.

## Data requirements

- Static content only, no persistence, no user input, no PII collected
  by this feature.
- Entity: `ReferenceCategory { category: string; links: ReferenceLink[] }`,
  `ReferenceLink { title: string; url: string; note?: string }`, as
  defined in FR-003.
- Source of truth: `src/data/references.md`, committed to the repo like
  any other source file. Editing it and rebuilding is the entire update
  mechanism — no admin UI, no database.

## Interfaces

- New route `/references`, added to `src/app/routes.ts` (FR-001).
- New: `src/features/references/ReferencesPage.tsx` (+ `.css`) — page
  component, following the existing page-shell pattern
  (`<div className="container ...">`, `<h1>`, intro `<p>`) already used
  by `ThreeDDesignsPage.tsx`/`AboutPage.tsx`.
- New: `src/data/references.md` — the editable content (FR-002).
- New: `src/data/references.ts` — the parser and typed export (FR-003).

## Existing components to reuse

- `components/ui/Button` (`href` prop) for each rendered link — it
  already detects `https://` URLs as external (`isExternal()`'s `//`
  check) and renders them as `target="_blank" rel="noopener noreferrer"`
  anchors, exactly what's needed here with no new external-link-handling
  code.
- The page-level layout pattern from `ThreeDDesignsPage.tsx`/
  `AboutPage.tsx` (`container` class, `<h1>`, intro paragraph).
- `src/data/home-weekly-update.ts`'s pattern (`?raw` import + a pure,
  independently-testable parse function + a parsed constant export) as
  the direct template for `references.ts`.
- The empty-state message pattern already established on the Read page
  (`_specs/features/how-to-articles/spec.md`) for FR-006.
- Design tokens from `src/styles/tokens.css` for spacing, headings, and
  card/list styling — no new colours or spacing values.

## Expected changes

- New: `src/features/references/ReferencesPage.tsx`,
  `ReferencesPage.css`, `ReferencesPage.test.tsx`.
- New: `src/data/references.md`, `src/data/references.ts`,
  `src/data/references.test.ts`.
- Modified: `src/app/routes.ts` (new route entry, FR-001).
- No changes to `MainNavigation`, `SiteHeader`, `SiteFooter`, or any
  other existing route/page.

## Constraints

- No backend, no CMS, no authenticated editing surface — content lives in
  a committed Markdown file, per `_specs/architecture.md` §17's Data
  Architecture guidance ("Markdown processed at build time").
- The parser must not throw on a malformed line — it must skip that line/
  bullet and continue, per the Non-functional maintainability requirement
  above and the Edge cases below.
- Once this feature exists, adding/editing/removing an entry in
  `references.md` (no category restructuring, no behavioural change)
  qualifies as a `CLAUDE.md` Content fast-path edit — no `CHG-*` spec
  needed for routine link-list maintenance.

## Edge cases

- `references.md` is missing a category entirely (e.g. only bullets, no
  `##` heading): those bullets are either skipped or grouped under an
  "Uncategorised" fallback — left as an Open Question (see below) since
  the spec doesn't need to prescribe which.
- A bullet line doesn't match the `[Title](url)` Markdown-link syntax at
  all (e.g. plain text, or a malformed link): that line is skipped, not
  rendered as a broken entry and not a build failure.
- A category heading has zero bullets under it: the category itself is
  omitted from render (no empty section heading with nothing beneath it).
- The whole file is empty or has no valid categories/links: the
  designed empty state renders (FR-006).
- A URL is not `https://`/`http://` (e.g. a `mailto:` or relative path
  slipped into the file by mistake): still rendered via `Button`'s `href`
  handling, which routes anything without `//` through the SPA router —
  acceptable behaviour, but a caution to document in `references.md`
  itself (e.g. a comment or brief note near the top) so Dave knows to use
  full `https://` URLs.

## Acceptance criteria

- Given a visitor opens the site, then a "References" link appears in
  main navigation between "3D Designs" and "Suggestions".
- Given a visitor navigates to `/references`, then they see a heading, an
  intro paragraph, and one section per category defined in
  `references.md`, each listing that category's links with visible
  titles.
- Given a visitor clicks a reference link, then it opens the target URL
  in a new browser tab, leaving the DavesFunRC site open in the original
  tab.
- Given `references.md` contains a bullet that doesn't match the
  `[Title](url) — note` pattern, then that single entry is silently
  skipped and the rest of the page renders normally (no crash, no
  visible error).
- Given `references.md` has no valid categories or links, then the page
  renders its designed empty state instead of blank section headings.
- Given the page renders, when checked against heading hierarchy and
  link accessible-name rules, then it satisfies WCAG 2.2 AA per
  `_specs/design-system.md`.

## Open questions

- Whether an uncategorised bullet (no preceding `##` heading) should be
  dropped or shown under a fallback "Uncategorised" section — left to
  implementation; either is acceptable since `references.md` will always
  be authored with categories in practice.
- Exact intro paragraph wording, category names, and the initial set of
  real reference links are not prescribed here — Dave supplies the real
  content in `references.md` after implementation (mirroring how
  `home-weekly-update.md` and `src/assets/read/` started with placeholder/
  empty content per their own specs). Implementation may seed
  `references.md` with 1–2 illustrative placeholder entries per category
  so the page doesn't look broken before Dave fills it in, or ship it
  empty relying on FR-006's empty state — left to implementation.
- Exact visual treatment of the note text (inline after the title vs. a
  second line) is left to implementation, following existing card/list
  conventions in `_specs/design-system.md`.

## Tests

- `src/data/references.test.ts`: category extraction from `##` headings;
  link extraction (`title`, `url`, optional `note`) from bullets; a
  bullet with no note; a malformed bullet is skipped without throwing; a
  category with zero valid bullets is omitted; empty input returns an
  empty array — mirroring `home-weekly-update.test.ts`'s structure.
- `src/features/references/ReferencesPage.test.tsx`: heading and intro
  render; one section per mocked category with correct link text/href/
  `target`/`rel`; empty-state message renders when the mocked data is
  empty (data module mocked via `vi.hoisted`, following
  `ReadPage.test.tsx`'s precedent for mocking a build-time data import).
- Existing `MainNavigation`/routing tests (if any assert the full route
  list) updated to include the new entry.
- Full existing suite must still pass: `npm run lint`, `npm run
  typecheck`, `npm run test`, `npm run build`.

## Completion

See `_specs/feature-index.md` for status tracking (updated by this Skill
to `Specified`; `implement-feature` will later update it to
`Implemented` with a full implementation summary).
