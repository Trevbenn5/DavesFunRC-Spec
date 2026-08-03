# Plan: How-To Articles (Read Page)

## Existing components/patterns to reuse

- `PageLayout`, `MainNavigation`, `ErrorBoundary` (via `App.tsx`) — no
  changes, automatic for any new route.
- Grid/skeleton/empty-state CSS pattern from `src/features/videos/
  VideosPage.css` (`.videos-page__grid`, `.videos-page__empty`) —
  mirrored for `.read-page__grid` / `.read-page__empty`.
- `PlaylistCard.tsx`/`.css` structure (image + heading + link, feature-
  local card component using `--radius-card`/`--shadow-small`/
  `--colour-surface`/`--colour-border` tokens) — mirrored for
  `ArticleCard`, but the whole card is the link (per FR-005), not just a
  `Button` inside it, and it does not use `Button` for the PDF link (see
  Constraints in the spec — `Button`'s `href` would route a bundled PDF
  URL through the SPA router).
- `siteConfig`/`Button` pattern for the empty-state fallback link
  (`Visit the...` style used on `VideosPage`/`HomePage`) — here, a link
  back to Home instead of an external channel link.

## Files expected to change

- `src/app/routes.ts` — add `{ path: '/read', label: 'Read', Component:
  ReadPage, showInNav: true }`.
- `src/features/home/HomePage.tsx` — Read highlight: `href: '/about'` →
  `/read`, `actionLabel: 'Learn more'` → `'Read articles'`.
- `src/features/home/HomePage.test.tsx` — add an assertion that the Read
  highlight links to `/read`.
- `_specs/feature-index.md` — mark `Implemented` with summary (on
  completion).

## New files

- `src/assets/read/` — new folder (empty until Dave supplies real
  articles; `.gitkeep` not needed since git tracks the folder once the
  feature's own files exist there, but the folder itself has no files
  yet, so add a placeholder note — see Risks).
- `src/features/read/articles.ts` — discovery module: globs
  `../assets/read/*.pdf` and `*.jpg` (and common case variants), pairs by
  basename, derives titles, sorts alphabetically, exports
  `ReadArticle[]`.
- `src/features/read/articles.test.ts` — unit tests for pairing/title-
  casing/sorting/orphan-exclusion logic, using mocked
  `import.meta.glob` results.
- `src/features/read/ReadPage.tsx` + `ReadPage.css` — page component:
  heading, grid of `ArticleCard`s, empty state.
- `src/features/read/ReadPage.test.tsx` — grid/empty-state tests.
- `src/features/read/components/ArticleCard.tsx` + `.css` — card
  component.
- `src/features/read/components/ArticleCard.test.tsx` — card tests.

## Data/API changes

None — no network calls, no new shared types. `ReadArticle` is a
feature-local type: `{ slug: string; title: string; pdfUrl: string;
thumbnailUrl: string }`.

## Dependencies

None new. Uses Vite's built-in `import.meta.glob` (already relied on
implicitly via `?raw` imports elsewhere) and native `<a>` for the PDF
link.

## Risks

- `import.meta.glob` needs a real, non-empty `src/assets/read/` directory
  to exist at build time for the glob's containing path to resolve
  cleanly. An empty folder with zero matches is valid (glob simply
  returns `{}`), but git does not track empty directories — if the
  directory has zero files, the folder itself won't be committed. Since
  this is expected (FR-007's empty state exists for exactly this
  situation), that's acceptable; not treated as a defect. When Dave adds
  a real `.pdf`/`.jpg` pair later, the folder appears naturally.
- Directly testing `import.meta.glob` in Vitest requires either running
  through Vite's transform (works automatically under `vitest`, which
  uses Vite) or mocking `import.meta.glob` in unit tests. Plan: let
  `articles.ts` call `import.meta.glob` directly (works under Vitest's
  Vite-powered transform, same as other `?raw` usages in this codebase)
  and additionally export a pure helper (e.g. `buildArticles(pdfEntries,
  jpgEntries)`) that `articles.test.ts` calls directly with synthetic
  entries — avoids fragile `vi.mock('import.meta.glob')` hacks while
  still testing the real pairing/sorting/title-casing logic.

## Acceptance criteria mapping

- FR-001–004, FR-007 → `articles.test.ts` (pairing, orphan exclusion,
  title-casing, sorting) + `ReadPage.test.tsx` (empty state).
- FR-005 → `ArticleCard.test.tsx` (plain `<a>`, `target="_blank"`,
  `rel="noopener noreferrer"`, single accessible name).
- FR-006 → `ReadPage.css` responsive grid (visual/manual check — no
  automated layout test, consistent with `VideosPage.css` precedent).
- FR-008 → `routes.ts` change, implicitly covered by
  `MainNavigation`'s existing route-driven rendering (no new nav test
  needed, same as other routes).
- FR-009 → `HomePage.test.tsx` new assertion.
