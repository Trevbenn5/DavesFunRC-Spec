# Scaffold Status

## Completion date

2026-07-24

(This is a rebuild — a previous scaffold and the About-page feature built on
top of it were deliberately removed first. See `_specs/architecture.md`
§34–§35 for the decisions carried over and updated during this rebuild.)

## Framework and major dependencies

- Vite `^8.1.5`
- Preact `^10.29.7` (`@preact/preset-vite ^2.10.6`)
- TypeScript `^6.0.3` (pinned below the `7.x` line — `typescript-eslint@8.65.0`'s
  peer range is `>=4.8.4 <6.1.0`, so TS 7 isn't lintable with it yet)
- ESLint `^10.7.0` + `@eslint/js` + `typescript-eslint` recommended configs
  only (no `eslint-plugin-preact` — unmaintained, no flat-config support; no
  `eslint-plugin-jsx-a11y` — its `6.10.2` peer range doesn't yet cover
  ESLint 10)
- Vitest `^4.1.10` + `@testing-library/preact` + `@testing-library/jest-dom`
  + `jsdom`
- `lucide-preact` (menu/close icons in mobile navigation)
- `npm audit`: 0 vulnerabilities as of this scaffold

## Application entry points

- HTML entry: `index.html`
- JS entry: `src/main.tsx` (renders `<App />` into `#app`, imports
  `src/styles/global.css`)
- Application shell: `src/app/App.tsx` (composes `RouterProvider`,
  `PageLayout`, `ErrorBoundary`, and the route outlet)
- Routing: `src/app/routes.ts` (route table) + `src/app/router.tsx` (small
  hand-rolled `history`-based router — no router package, per
  `_specs/architecture.md` §29's preference for a local implementation given
  the small, fixed route table)

## Shared layout locations

- `src/components/layout/PageLayout.tsx` — skip link, header, main, footer.
  `.page-layout` is a `min-height: 100%` flex column (`html`/`body`/`#app`
  set to `height: 100%` in `src/styles/global.css`) with `<main>` set to
  `flex: 1 0 auto`, so the footer stays pinned to the bottom of the
  viewport on short pages and scrolls normally with taller content — see
  [CHG-001](changes/CHG-001-sticky-footer-layout.md).
- `src/components/layout/SiteHeader.tsx` / `SiteFooter.tsx`
- `src/components/layout/ErrorBoundary.tsx` — global error boundary
- `src/components/navigation/MainNavigation.tsx` — horizontal desktop nav
  (centered), hamburger menu on mobile (`≤768px`)
- `src/components/content/PlaceholderPage.tsx` / `NotFoundPage.tsx` — shared
  stub content for routes and unknown paths
- `src/components/ui/Button.tsx`, `Card.tsx` — only the components an actual
  page currently needs; the rest of the design system's component list
  (Modal, Table, Form, etc.) is built when a feature first requires it

## Design system locations

- `src/styles/tokens.css` — colour palette, spacing, radius, shadow tokens
  from `_specs/design-system.md` (indigo/orange/mustard palette sourced from
  `assets/Banner.jpg` and `assets/Chaotic_Thumbnail 2.jpg`)
- `src/styles/reset.css`, `typography.css`, `utilities.css`, `global.css`
- Fonts: Inter (body/UI) and Kalam (brand wordmark + Home hero H1 only,
  via the `.brand-wordmark` utility class), loaded from Google Fonts in
  `index.html`
- `src/assets/` — component-imported image assets (Vite fingerprints these
  for cache-busting), as distinct from `public/` (copied unprocessed). First
  used by `src/assets/home/banner.jpg`, a copy of `assets/Banner.jpg`
  imported by `src/features/home/HomePage.tsx` — see
  [CHG-002](changes/CHG-002-home-hero-imagery.md).

## Pages

All five routes from `_specs/product.md`'s route inventory exist and are
reachable from the nav: `/` (Home — the only page with real content so far),
`/videos`, `/3d-designs`, `/suggestions`, `/about` (placeholder content via
`src/components/content/PlaceholderPage.tsx`, one feature folder each under
`src/features/`). Unknown paths render `NotFoundPage`.

## Test commands

```
npm run test        # vitest run
npm run typecheck    # tsc -b --noEmit
npm run lint         # eslint .
```

## Build commands

```
npm run dev          # vite dev server
npm run build         # tsc -b && vite build
npm run preview       # vite preview (serves dist/)
```

## Architectural constraints

See `_specs/architecture.md` for the full rule set. Key points affecting
every future feature:

- Base path is `base: '/'` with `public/CNAME` set to `davesfunrc.com` (a
  custom domain, not a `username.github.io/repo/` project path). If the
  custom domain is ever dropped, `vite.config.ts`'s `base` and
  `public/CNAME` must change together.
- GitHub Pages has no server-side fallback routing — `public/404.html`
  stashes the intended path to `sessionStorage` and redirects to `/`;
  `index.html`'s inline script restores it via `history.replaceState`
  before the app renders.
- No dependency was added for state management, a second router, or a
  component library — none of the pages need one yet.
- `src/hooks/`, `src/services/`, `src/data/`, `src/types/`, `src/utils/`
  and `tests/integration/` from the architecture doc's target structure
  were not created — git doesn't track empty directories, and placeholder
  files in them would be scaffolding beyond what any current feature needs.
  Create each one the first time a feature actually needs it.
