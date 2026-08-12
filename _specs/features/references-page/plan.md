# Plan: References Page

## Existing components/patterns to reuse

- `components/ui/Button` (`href` prop) — external-link handling already
  covers `https://` URLs (`isExternal()`'s `//` check), used for every
  rendered reference link and the empty-state's "Back to Home" link
  (`ReadPage.tsx` precedent).
- Page shell pattern: `<div className="container ...">`, `<h1>`, intro
  `<p>` (`ThreeDDesignsPage.tsx`, `AboutPage.tsx`).
- `src/data/home-weekly-update.ts` — `?raw` import + pure parse function
  + parsed constant export, directly templated for `references.ts`.
- `ReadPage.tsx`'s conditional grid/empty-state rendering pattern and
  `ReadPage.test.tsx`'s `vi.mock` + `vi.hoisted` approach for mocking a
  build-time data import in tests.
- Design tokens from `src/styles/tokens.css` — no new tokens.

## Files expected to change

- `src/app/routes.ts` — add `ReferencesPage` import and a new route entry
  between `3D Designs` and `Suggestions` (FR-001).

## New files

- `src/data/references.md` — editable content, seeded with a couple of
  illustrative placeholder entries per category (Open Questions: chosen
  over shipping empty, so the page demonstrates real layout immediately;
  Dave replaces these with real links afterward as a Content fast-path
  edit).
- `src/data/references.ts` — `ReferenceLink`, `ReferenceCategory` types,
  `parseReferences()` pure function, `referenceCategories` parsed
  constant (FR-002, FR-003).
- `src/data/references.test.ts` — parser unit tests (FR-002/FR-003, Edge
  cases).
- `src/features/references/ReferencesPage.tsx` (+ `.css`) — page
  component (FR-004, FR-005, FR-006).
- `src/features/references/ReferencesPage.test.tsx` — page tests.

## Data/API changes

None — static Markdown parsed at build time, no new env vars, no
external service.

## Tests to add/update

- `src/data/references.test.ts`: category extraction, link extraction
  (title/url/note), bullet with no note, malformed bullet skipped,
  category with zero valid bullets omitted, empty input → `[]`.
- `src/features/references/ReferencesPage.test.tsx`: heading + intro
  render; one section per mocked category with correct link text/href/
  `target`; empty state renders when mocked data is empty.

## Dependencies

None new.

## Risks

- Markdown parsing regex must tolerate the note separator being an em
  dash `—` or a plain hyphen `-`/`--` without false-splitting on hyphens
  inside URLs — mitigated by only treating ` — ` / ` -- ` (surrounded by
  spaces, after the closing `)`) as the note separator, never a bare
  intra-URL `-`.
- Low risk otherwise: purely additive, no shared component or existing
  route touched besides the one new array entry in `routes.ts`.

## Acceptance criteria mapping

- Nav position (3D Designs → References → Suggestions) → FR-001, route
  order in `routes.ts`.
- Categorised sections + links render → FR-002–FR-005,
  `ReferencesPage.test.tsx`.
- Links open in a new tab → FR-005, `Button`'s existing external-link
  behaviour, asserted in `ReferencesPage.test.tsx`.
- Malformed bullet skipped, no crash → FR-002/FR-003 parser rule,
  `references.test.ts`.
- Empty data → empty state → FR-006, both test files.
