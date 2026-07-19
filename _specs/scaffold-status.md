# Scaffold Status

## Completion date

2026-07-19

## Framework and major dependencies

- Vite 6 (`@preact/preset-vite`)
- Preact 10
- TypeScript 5.7 (strict mode)
- Vitest 4 + `@testing-library/preact` + `@testing-library/jest-dom` (jsdom environment)
- ESLint 9 flat config (`@eslint/js` + `typescript-eslint` recommended rules)

## Application entry points

- HTML entry: [index.html](../index.html)
- JS entry: [src/main.tsx](../src/main.tsx)
- App shell: [src/app/App.tsx](../src/app/App.tsx)

## Shared layout locations

- `src/components/layout/PageLayout.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`
- `src/components/navigation/MainNavigation.tsx`
- `src/components/content/PagePlaceholder.tsx`, `NotFoundPage.tsx`
- `src/components/ui/Button.tsx`, `Card.tsx`

## Design system locations

- `src/styles/tokens.css` — colour, spacing, radius, shadow custom properties
  from `_specs/design-system.md`
- `src/styles/reset.css`, `typography.css`, `global.css`

## Test commands

```
npm run test        # vitest run (unit/component)
npm run test:watch  # vitest watch mode
```

Sample test: `tests/unit/App.test.tsx` (home page render, nav links, 404
fallback). No Playwright/e2e suite yet — add one under `tests/integration`
when a feature has a critical user journey worth covering end-to-end.

## Build commands

```
npm run dev         # local dev server
npm run lint         # eslint .
npm run typecheck    # tsc --noEmit
npm run build         # tsc --noEmit && vite build -> dist/
npm run preview       # preview the production build locally
```

All four (`lint`, `typecheck`, `test`, `build`) pass as of this scaffold.

## Architectural constraints

See `_specs/architecture.md` for the full rules. Notably:

- Vite + Preact + TypeScript only; no second framework, router package, or
  state-management library without an accepted architectural decision.
- Static output only — no server runtime, no database.
- GitHub Pages is the hosting platform, deployed via
  `.github/workflows/deploy-pages.yml` on push to `main`.
- `base: '/'` is configured because this project targets the custom domain
  `DavesFunRC.com` (see `public/CNAME`), not a `/repo-name/` project-page
  path. If the custom domain is dropped, `vite.config.ts`'s `base` and
  `public/CNAME` both need to change together — see architecture.md §13.

## Routing

Client-side routing via a small hand-rolled history-based router
(`src/app/router.tsx`, route table in `src/app/routes.ts`), per
architecture.md §12's preference for a local implementation over a router
package at this scale. GitHub Pages' lack of fallback routing is handled by
the standard `public/404.html` redirect-and-decode technique (decode script
lives in `index.html`).

Only `/` (Home) has real content. `/videos`, `/3d-designs` and `/about` are
registered routes rendering a shared `PagePlaceholder` component — build out
their actual content via `/create-feature-spec` + `/implement-feature`.

## Known follow-ups

- `_specs/static-assets/` referenced by `CLAUDE.md` and a
  `color_pallette.jpeg` referenced by `design-system.md` do not exist in this
  repo. The palette was applied from the hex values written directly in
  `design-system.md` instead.
- No Playwright/e2e setup yet — add when a feature has a critical journey
  worth testing end-to-end (architecture.md §21).
