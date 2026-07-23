# Scaffold Status

## Completion date

2026-07-24

## Framework and major dependencies

- Build tool: Vite `^8.1.5`
- Frontend framework: Preact `^10.29.7` via `@preact/preset-vite`
- Language: TypeScript `^6.0.3`
- Icons: `lucide-preact` `^1.26.0`
- Linting: ESLint `^10.7.0` (flat config) + `typescript-eslint` `^8.65.0`
  recommended rules (no `eslint-plugin-preact` — see note below)
- Testing: Vitest `^4.1.10`, `@testing-library/preact`,
  `@testing-library/jest-dom`, `jsdom`

`npm audit` reports 0 vulnerabilities as of this scaffold.

## Application entry points

- `index.html` — static shell, font links, SPA-redirect decode script
- `src/main.tsx` — renders `App` into `#app`
- `src/app/App.tsx` — application shell (header, routed content, footer)
- `src/app/router.tsx` — hand-rolled `history`-based router (`RouterProvider`,
  `useRouter`, `Link`) — chosen over a router package per
  `_specs/architecture.md` §12/§29, since the route table is small and fixed
- `src/app/routes.ts` — centralised route table (path + nav label)
- `src/app/app-config.ts` — site-wide config (name, external links)

## Shared layout locations

- `src/components/layout/` — `PageLayout`, `SiteHeader`, `SiteFooter`
- `src/components/navigation/MainNavigation.tsx` — horizontal desktop nav,
  hamburger menu on mobile (`lucide-preact` Menu/X icons)
- `src/components/content/` — `PagePlaceholder`, `NotFoundPage`
- `src/components/ui/` — `Button`, `Card`

## Design system locations

- `src/styles/tokens.css` — CSS custom properties for colour, spacing,
  radius, shadow and motion, transcribed from `_specs/design-system.md`
- `src/styles/reset.css`, `src/styles/typography.css`,
  `src/styles/global.css` — imported together from `src/styles/global.css`

## Routes

`/` (Home), `/videos`, `/3d-designs`, `/suggestions`, `/about` — from
`_specs/product.md`'s page/route inventory. Only Home has real content;
the rest render `PagePlaceholder` until their features are built. Unknown
paths render `NotFoundPage`.

## Test commands

```
npm run test
```

## Build commands

```
npm run lint
npm run typecheck
npm run build
```

All four pass as of this scaffold.

## Architectural constraints

See `_specs/architecture.md` §30 (Architectural Constraints) — unchanged
by this scaffold. Notable implementation choices, consistent with a
previous scaffold attempt at this repository (see §34/§35 of that
document):

- GitHub Pages base path is `base: '/'` with `public/CNAME` set to
  `www.davesfunrc.com` — targeting the custom domain named in
  `_specs/product.md` rather than a `username.github.io/repo/` path. If
  the custom domain is dropped, `vite.config.ts`'s `base` and
  `public/CNAME` must change together.
- GitHub Pages has no server-side fallback routing, so direct navigation
  to a client-side route is handled via `public/404.html` (stores the
  requested path in `sessionStorage`, redirects to `/`) plus a decode
  script in `index.html`'s `<head>` that restores the path via
  `history.replaceState` before Preact mounts.
- `eslint-plugin-preact` was not added — it is unmaintained and has no
  ESLint 9+ flat-config support. Linting relies on `@eslint/js` +
  `typescript-eslint` recommended rules only.
- Inter and Kalam are loaded via Google Fonts `<link>` tags in
  `index.html` rather than self-hosted, to keep the scaffold minimal.
  `--font-brand` (Kalam) is applied only via the `.brand-wordmark` class
  (site wordmark, Home H1) — never to body copy, per the design system.
- Deferred empty directories: `src/hooks/`, `src/services/`,
  `src/data/`, `src/types/`, `src/utils/` and `tests/integration/` from
  the target repository structure were not created, since git does not
  track empty directories and no current feature needs them yet.
- Detailed Home page styling (using `assets/Banner.jpg` as a header
  image, incorporating `assets/Me Circle.png`, per
  `_specs/product.md`'s "Style of homepage" section) is intentionally
  out of scope for this scaffold — `HomePage.tsx` is a minimal
  placeholder, per the create-scaffold Skill's instruction not to
  implement detailed business features during scaffolding. That styling
  is expected to land as a future feature or change.
