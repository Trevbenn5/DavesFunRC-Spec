# Feature: How-To Articles (Read Page)

## Purpose

`_specs/product.md` lists "Articles by category ... " as a core feature and
the Home page's "Read" highlight card already promises "How-to articles on
construction techniques, CAD design, 3D printing and getting started" — but
today that card links to `/about` as a placeholder, and no `/read` route
exists. This feature gives Dave a low-effort way to publish How-To articles
himself: he authors each article as a single self-contained PDF (large title
and graphic at the top, per his own formatting convention) and drops it,
plus a matching preview image, into an assets folder. No CMS, backend, or
new dependency is introduced — the site discovers whatever PDF/image pairs
exist at build time and lays them out as a grid of clickable cards.

## Scope

- A new `/read` page listing every How-To article as a tiled card in a
  responsive CSS grid.
- A folder convention under `src/assets/read/` where each article is a pair
  of files sharing a basename: `<slug>.pdf` (the article) and `<slug>.jpg`
  (a preview image showing roughly the top/first half of the PDF — title
  and graphic — that Dave produces himself, e.g. a screenshot or exported
  page image).
- Each card shows: the preview image, a title (derived from the filename),
  and a link that opens the full PDF in a new browser tab.
- Wiring the new page into the app: an entry in `src/app/routes.ts` (adds
  it to `MainNavigation` automatically) and updating the Home page's
  existing "Read" highlight card (`src/features/home/HomePage.tsx`) to
  link to `/read` instead of the `/about` placeholder.
- An empty state for when the folder contains no article pairs yet.

## Out of scope

- Any server-side or build-time PDF text extraction. The "preview" is the
  image Dave supplies, not machine-generated from the PDF's text.
- Category filtering/tagging (Tech Support, Construction Techniques, CAD
  Design, 3D Printing, Getting Started from `_specs/product.md`) — every
  article renders in one undifferentiated grid. Categorisation is a
  candidate future feature, not part of this one (see Open questions).
- In-page PDF viewing/embedding — the card links out to the browser's
  native PDF handling in a new tab.
- An authoring UI or upload mechanism — articles are added by committing
  files to the repository.
- Manual ordering or featured/pinned articles — see Open questions.
- Any change to `SiteHeader`, `SiteFooter`, `MainNavigation`'s component
  code, or other pages besides the Home highlight-card link fix described
  above.

## User stories

- As a visitor, I want to browse Dave's How-To articles as a set of
  recognisable cards, so I can spot one I'm interested in without opening
  each PDF blind.
- As Dave, I want to publish a new How-To article by dropping two files
  into a folder and rebuilding the site, without touching component code.

## User experience

Visiting `/read` shows a page heading and a CSS-grid of cards, one per
article pair found under `src/assets/read/`. Each card shows the preview
image at the top, the article's title below it, and the whole card is a
single link — clicking anywhere on it opens the source PDF in a new tab.
Cards wrap responsively: multiple per row on desktop, fewer on tablet,
one per row on mobile (matching the existing responsive grid pattern used
by `VideosPage.css`'s playlist gallery).

If no article pairs exist yet, the page shows an empty-state message
explaining that articles are coming soon, per `_specs/design-system.md`'s
Empty States rules (explanation + optional illustration + primary
action — here, a link back to Home).

The Home page's "Read" highlight card continues to show its existing
title/description; only its link target and action label change (e.g.
"Read articles") so it correctly points at the new page.

## Functional requirements

- FR-001: The app discovers article pairs at build time from
  `src/assets/read/` by matching files with the same basename: `<slug>.pdf`
  and `<slug>.jpg` (case-insensitive extension).
- FR-002: A PDF with no matching JPG, or a JPG with no matching PDF, is
  silently excluded from the grid (not an error) — both halves of a pair
  must be present for an article to render.
- FR-003: Each rendered article's title is derived from its filename slug
  by replacing hyphens/underscores with spaces and title-casing the result
  (e.g. `foam-wing-sheeting.pdf` → "Foam Wing Sheeting"). No separate
  metadata file is introduced for titles in this iteration.
- FR-004: Articles render sorted alphabetically by title.
- FR-005: Each card is a single accessible link (whole card clickable,
  one accessible name — the title) opening the PDF's bundled asset URL in
  a new tab (`target="_blank" rel="noopener noreferrer"`), not through the
  SPA router (see Constraints — `Button`'s `href` handling doesn't apply
  here).
- FR-006: The grid is a responsive CSS grid: multiple columns on desktop,
  collapsing toward a single column as viewport width decreases, with no
  horizontal scrolling at any width.
- FR-007: If zero article pairs are found, the page renders an empty-state
  message instead of an empty grid, with a link back to Home.
- FR-008: `src/app/routes.ts` gains a `{ path: '/read', label: 'Read',
  showInNav: true }` entry so the page is reachable from `MainNavigation`
  automatically.
- FR-009: The Home page's existing "Read" highlight card
  (`src/features/home/HomePage.tsx`) is updated to link to `/read` (was
  `/about`), with an action label reflecting that destination (was "Learn
  more").

## Non-functional requirements

- Accessibility: each card's preview image has descriptive alt text (e.g.
  "Preview of the {title} article"); the card link has a clear accessible
  name; keyboard-focusable with a visible focus indicator; heading
  hierarchy follows the page's existing H1/H2 conventions; WCAG 2.2 AA
  contrast on card text.
- Performance: no new npm dependency — file discovery uses Vite's built-in
  `import.meta.glob`, same static-asset pipeline already used for images
  elsewhere (e.g. `src/assets/home/banner.jpg`). Dave is responsible for
  keeping preview JPGs reasonably sized (the existing
  `WeeklyUpdate`/`foam-sheet-construction.jpg` precedent of exporting at a
  sensible long-edge width applies).
- Security: PDFs are static trusted files committed by Dave, not
  user-uploaded content — no sanitisation/scanning requirement beyond what
  already applies to any static asset.

## Data requirements

- No new data structures, services, or persistence — articles are derived
  entirely from filenames present in `src/assets/read/` at build time.
- In-memory shape per article (feature-local type, not shared): `{ slug:
  string; title: string; pdfUrl: string; thumbnailUrl: string }`.

## Interfaces

- New route: `/read`.
- New feature folder: `src/features/read/` containing `ReadPage.tsx` (+
  `.css`), an article-discovery module (e.g. `articles.ts`, using
  `import.meta.glob(..., { eager: true, query: '?url', import: 'default'
  })` against `src/assets/read/*.pdf` and `*.jpg`), and a card component
  (e.g. `components/ArticleCard.tsx` + `.css`).
- New asset folder: `src/assets/read/` (author drops `<slug>.pdf` /
  `<slug>.jpg` pairs here).
- Modified: `src/app/routes.ts` (new route entry), `src/features/home/
  HomePage.tsx` (Read highlight card's `href`/`actionLabel`).

## Existing components to reuse

- `PageLayout`, `MainNavigation`, `ErrorBoundary` — automatic for any
  routed page via `App.tsx`; no changes needed.
- Design tokens from `src/styles/tokens.css` (card border-radius 12px,
  small shadow) and the responsive grid pattern already established in
  `src/features/videos/VideosPage.css` (`repeat(3, 1fr)` → single column)
  should inform the new grid/card CSS, even though a new `ArticleCard`
  component is needed (the shared `components/ui/Card` component's API —
  title/summary/`Button` action — doesn't fit an image-led, whole-card-
  clickable tile).
- Precedent from `videos-playlist-gallery`'s `PlaylistCard` (image +
  title + external link, feature-local component) and `home-weekly-
  update`'s image-export approach are the closest existing patterns.

## Expected changes

- New: `src/assets/read/` (folder, with at least one real `.pdf`/`.jpg`
  pair supplied by Dave before this ships).
- New: `src/features/read/ReadPage.tsx`, `ReadPage.css`, `articles.ts`,
  `components/ArticleCard.tsx`, `components/ArticleCard.css`, plus test
  files.
- Modified: `src/app/routes.ts`, `src/features/home/HomePage.tsx`.

## Constraints

- `components/ui/Button`'s `href` prop routes internal-looking paths
  (anything not matching `//`) through the SPA router's `navigate()`,
  which would break a bundled PDF asset URL. The card's PDF link must be a
  plain `<a>` (or a `Button`-styled element that bypasses that routing),
  not `Button` used as-is.
- No PDF-parsing library is introduced (see Out of scope) — keeps the
  build dependency-free per `_specs/architecture.md` §29's "don't add a
  dependency when a small local implementation is clearer" rule.
- Must remain a static build — `import.meta.glob` resolves at build time,
  so adding a new article requires a rebuild/redeploy, not a runtime
  fetch.

## Edge cases

- Zero article pairs: empty-state message (FR-007), not a blank grid or
  an error.
- Orphaned PDF or orphaned JPG (missing its pair): excluded silently
  (FR-002).
- Duplicate slugs differing only by extension case (e.g. `Foo.PDF` vs
  `foo.pdf`) are an authoring error outside this feature's handling — not
  designed for.
- Very long filenames/titles: card layout must not overflow or break the
  grid (wrap or truncate with accessible full title still available, e.g.
  via the link's accessible name).

## Acceptance criteria

- Given at least one `.pdf`/`.jpg` pair exists under `src/assets/read/`,
  when a visitor opens `/read`, then a card renders showing that pair's
  preview image and a title derived from its filename.
- Given a rendered card, when the visitor clicks anywhere on it, then the
  corresponding PDF opens in a new browser tab.
- Given a `.pdf` file with no matching `.jpg` (or vice versa), when the
  page builds, then no card renders for that orphaned file and no build
  error occurs.
- Given zero valid pairs exist, when a visitor opens `/read`, then an
  empty-state message renders with a link back to Home.
- Given the Home page, when a visitor views the "Read" highlight card,
  then its action link navigates to `/read`.
- Given the viewport is resized from desktop to mobile width, when the
  `/read` grid is visible, then cards reflow to fewer columns and no
  horizontal scrolling occurs.
- Given a visitor uses only the keyboard, when tabbing through the `/read`
  page, then every card link receives a visible focus indicator and can be
  activated with Enter.

## Open questions

- Should articles support categories (matching `_specs/product.md`'s Tech
  Support / Construction Techniques / CAD Design / 3D Printing / Getting
  Started list) in a future iteration, via subfolders or a metadata file?
  Not answered here — deferred, since this feature's request was
  specifically about the grid-of-cards display mechanism.
- Should article order ever be controllable by Dave (e.g. featured/pinned
  first) rather than always alphabetical? Deferred — alphabetical (FR-004)
  is the simplest default.
- Exact preview-image aspect ratio/crop isn't prescribed here since Dave
  is producing these manually; the implementation should pick one
  consistent `object-fit` treatment so mismatched source image dimensions
  don't distort the grid.

## Tests

- `articles.ts` (or equivalent discovery module): pairs matched correctly
  by basename, orphaned PDF/JPG excluded, title-casing of hyphenated/
  underscored filenames, alphabetical sort.
- `ArticleCard.test.tsx`: renders title, preview image with non-empty alt
  text, link points at the PDF asset URL, opens in a new tab
  (`target="_blank"`, `rel="noopener noreferrer"`).
- `ReadPage.test.tsx`: grid renders one card per discovered pair; empty
  state renders (with fallback link) when no pairs exist; heading
  hierarchy is correct.
- `HomePage.test.tsx`: existing "Read" highlight card now asserts an
  `/read` link (update rather than duplicate the existing highlights
  assertion).
- Full existing suite must still pass: `npm run lint`, `npm run
  typecheck`, `npm run test`, `npm run build`.

## Completion

See `_specs/feature-index.md` for status tracking (updated by this Skill
to `Specified`; `implement-feature` will later update it to
`Implemented` with a full implementation summary).
