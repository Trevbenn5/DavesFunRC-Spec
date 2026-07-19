# Feature Index

| Feature | Spec | Status | Dependencies |
| --- | --- | --- | --- |
| About Page | [_specs/features/about-page/spec.md](features/about-page/spec.md) | Implemented | None — reuses existing scaffold routing (`/about`) and `PageLayout` |

## About Page — implementation summary

`/about` now renders `src/features/about/AboutPage.tsx`, showing the
verbatim About copy from `_specs/product.md` as 12 paragraphs under an H1
"About", replacing the `PagePlaceholder` stub. No shared components,
routes, or design tokens were changed.

Tests:
- [src/features/about/AboutPage.test.tsx](../src/features/about/AboutPage.test.tsx) — heading, verbatim opening/closing lines, paragraph count
- [tests/unit/App.test.tsx](../tests/unit/App.test.tsx) — `/about` renders the real page, not the placeholder

`lint`, `typecheck`, `test` (7/7 passing), and `build` all pass. Verified
in-browser: content renders correctly, nav round-trips Home → About →
Home.
