# Plan: About Page

## Existing components to reuse

- `PageLayout` (via `src/app/App.tsx`) — header, main landmark, footer,
  skip link. No change needed.
- `src/features/home/HomePage.tsx` / `HomePage.css` as the structural
  pattern: a `<section>` with a heading and paragraphs, colocated CSS for
  any spacing beyond global typography defaults.
- Global typography/tokens (`src/styles/typography.css`,
  `src/styles/tokens.css`) for heading and paragraph styling — no new
  tokens needed.

## Files expected to change

- `src/app/App.tsx` — swap `<PagePlaceholder title="About" />` for
  `<AboutPage />` on the `/about` case.

## New files expected

- `src/features/about/AboutPage.tsx`
- `src/features/about/AboutPage.css` (minimal — top/bottom padding to
  match `HomePage`'s rhythm)
- `src/features/about/AboutPage.test.tsx`

## Data or API changes

None. Text is static and inlined in the component (per spec's Data
requirements).

## Tests to add or update

- New: `src/features/about/AboutPage.test.tsx`
  - Exactly one `<h1>` with text "About" (FR-003).
  - Opening line ("This site is all about having fun with RC planes...")
    and closing line ("Thanks for stopping by, and happy flying!") both
    present, to guard against truncation/paraphrasing (FR-002).
  - Paragraph count matches the number of non-empty lines in
    `_specs/product.md`'s About section (12 lines → 12 `<p>` elements)
    (FR-004).
- Update: `tests/unit/App.test.tsx` — add a case asserting that
  navigating to `/about` renders the About heading and no longer shows
  the `PagePlaceholder` "on the workbench" copy (FR-001).

## Dependencies

None new.

## Risks

- Low risk: isolated, additive change to one route's content; no shared
  component, routing, or config touched.
- Main risk is a transcription error in the verbatim text — mitigated by
  copying the paragraphs directly from `_specs/product.md` and testing
  the first/last lines plus paragraph count.

## Acceptance criteria mapping

| Acceptance criterion | Covered by |
| --- | --- |
| Nav click renders About page with H1 + full text | `AboutPage.test.tsx` (heading + line checks) + existing `MainNavigation` (unchanged) |
| Direct navigation to `/about` renders same content | Existing SPA fallback (`public/404.html`, unchanged) — no new test needed, mechanism already covered by scaffold |
| Rendered text matches product.md verbatim | `AboutPage.test.tsx` opening/closing line + paragraph-count assertions |
| Heading levels start at H1, none skipped | `AboutPage.test.tsx` (`getByRole('heading', { level: 1 })`) |
| Mobile viewport, no horizontal scrolling | Inherited from `PageLayout`/global styles (same mechanism as Home page, already scaffold-verified) — manual browser check during Verification |

## Status

Planned — implementation follows in this same session.
