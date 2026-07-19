# Feature: About Page

## Purpose

Give visitors the DavesFunRC origin story and personal context — who's
behind the channel and the site, and why the site exists — in the
low-key, friendly, informal voice `_specs/product.md` calls for. This
builds trust and gives the "budget-friendly hobby, not a sales pitch"
framing readers need before they dig into videos or designs.

## Scope

- Render the verbatim About copy from `_specs/product.md`'s `# About`
  section at the existing `/about` route.
- Replace the current `PagePlaceholder` stub used for `/about` with real
  page content.

## Out of scope

- External links (YouTube, Cults3D, Ko-Fi) — `_specs/product.md`'s Pages
  section assigns those to the separate 3D Designs page, not About.
- Any imagery, portrait, or workshop photo — none is specified for this
  page (see Open questions).
- Changes to navigation, routing table, layout, or any other page.

## User stories

- As a site visitor, I want to read about who makes DavesFunRC and why,
  so I can decide whether the content is a good fit for me.
- As a returning-to-the-hobby or budget-conscious builder, I want to see
  that the site's philosophy matches mine ("shoestring budget", no sales
  pressure) before trusting its advice.

## User experience

- Visitor reaches the page either by clicking "About" in the main
  navigation (already wired to `/about`) or by navigating directly to
  `/about` (handled by the existing GitHub Pages SPA fallback).
- Page shows a single H1 "About" followed by the biography text from
  `_specs/product.md`, broken into paragraphs matching the line breaks in
  that source document (each line in the spec's About section becomes its
  own `<p>`), for readability — the source is one dense block otherwise.
- No interactive elements, forms, loading state, or empty state apply:
  the content is static and always present.
- Layout, spacing, and typography follow the same conventions as the
  existing Home page (`src/features/home/HomePage.tsx`).

## Functional requirements

- FR-001: The `/about` route renders the new About page component instead
  of `PagePlaceholder`.
- FR-002: The page displays the About text from `_specs/product.md`
  verbatim and in full, with no paraphrasing, trimming, or added marketing
  language.
- FR-003: The page has exactly one `<h1>` reading "About".
- FR-004: The body text is broken into paragraphs at the line breaks
  present in `_specs/product.md`'s About section.
- FR-005: The existing "About" link in `MainNavigation` continues to
  navigate to this page and show `aria-current="page"` when active — no
  changes needed to `MainNavigation`, but this must not regress.

## Non-functional requirements

- Accessibility: semantic HTML, heading hierarchy starts at H1 with no
  skipped levels, sufficient colour contrast using existing tokens,
  visible focus indicators (inherited from global styles), readable at
  responsive text scaling.
- Performance: static content only, no additional client-side JavaScript,
  no new dependencies, no additional network requests.
- Privacy/security: no user input, no data collection, nothing to
  validate or sanitise.
- Responsive: must render without horizontal scrolling on desktop,
  tablet, and mobile, using the existing `--page-padding-desktop` /
  `--page-padding-mobile` tokens via `PageLayout`.

## Data requirements

None. The About text is static copy, not a repeatable/list-like data
structure, so — consistent with how `HomePage.tsx` inlines its own copy —
it is written directly in the component rather than extracted to
`src/data/`.

## Interfaces

- New feature component: `src/features/about/AboutPage.tsx` (plus a
  colocated `AboutPage.css` only if spacing needs differ from what global
  typography already provides — follow the `HomePage`/`HomePage.css`
  pattern).
- Modified: `src/app/App.tsx` — the `/about` case in `CurrentPage` swaps
  `<PagePlaceholder title="About" />` for `<AboutPage />`.
- No new routes, services, or APIs.

## Existing components to reuse

- `PageLayout` (via `App.tsx`, already wraps every route — header, main
  landmark, footer, skip link).
- Global typography and spacing from `src/styles/typography.css` and
  `src/styles/tokens.css` — no new tokens or styles needed beyond what a
  simple heading + paragraphs already gets for free.
- `src/features/home/HomePage.tsx` as the structural pattern to follow
  for a new top-level content feature (a simple `<section>` with heading
  and paragraphs, plus an optional colocated CSS file).

## Expected changes

- New: `src/features/about/AboutPage.tsx`
- New (only if needed): `src/features/about/AboutPage.css`
- New: a test file for the About page (see Tests)
- Modified: `src/app/App.tsx` (swap the placeholder for the real
  component on the existing `/about` case)
- Modified: `tests/unit/App.test.tsx` may need a small addition/adjustment
  if it asserts placeholder content for `/about` today (it currently does
  not — it only checks home, nav, and an unknown route)

No changes to `src/app/routes.ts`, `MainNavigation`, `PageLayout`,
`SiteHeader`, `SiteFooter`, design tokens, or project configuration.

## Constraints

- Feature-specific code stays under `src/features/about/` per
  architecture.md §9; do not promote anything to `src/components/` unless
  it becomes genuinely reusable elsewhere (nothing here is expected to).
- Do not modify the application shell, routing conventions, or any shared
  component beyond the one-line swap in `App.tsx`'s `CurrentPage` switch.
- No new dependencies.
- Text must match `_specs/product.md` verbatim — this spec does not invent
  or adjust the biography content.

## Edge cases

- Direct navigation / page refresh at `/about`: already covered by the
  existing `public/404.html` redirect-and-decode fallback; no new handling
  needed.
- Unknown/mistyped routes: unaffected, still handled by the existing
  `NotFoundPage`.
- No loading, error, or empty states apply — the content is static and
  always renders synchronously.

## Acceptance criteria

- Given a visitor on any page, when they click "About" in the main
  navigation, then the About page renders with an H1 reading "About" and
  the full biography text.
- Given a visitor who navigates directly to `/about`, when the page loads,
  then the same About content renders (via the existing SPA fallback).
- Given the rendered About page, when its text is compared to
  `_specs/product.md`'s `# About` section, then it matches verbatim.
- Given a screen reader or accessibility audit, when the About page is
  inspected, then heading levels start at H1 with none skipped.
- Given a mobile viewport, when viewing `/about`, then content is fully
  readable with no horizontal scrolling.

## Open questions

- `_specs/product.md` does not specify any imagery (portrait, workshop
  photo) for the About page. This spec assumes text-only. If an image is
  wanted later, that's a separate change once an asset exists under
  `_specs/static-assets/`.

## Tests

- Component test (e.g. `src/features/about/AboutPage.test.tsx` or
  `tests/unit/AboutPage.test.tsx`, matching whichever convention
  `implement-feature` finds cleaner):
  - Renders exactly one `<h1>` with text "About".
  - Renders the full verbatim About text (or a sufficiently distinctive
    excerpt, e.g. the opening and closing lines) to guard against
    accidental truncation or paraphrasing.
- Update `tests/unit/App.test.tsx` (or add a new case) to assert that
  navigating to `/about` renders the About page's heading rather than the
  `PagePlaceholder` "on the workbench" copy.
- No new test data required — the source text is `_specs/product.md`
  itself.
