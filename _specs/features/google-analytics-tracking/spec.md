# Feature: Google Analytics Tracking

## Purpose

Dave (the site owner) currently has no visibility into how visitors use
DavesFunRC.com — which pages get read, how people navigate between
Videos / 3D Designs / Suggestions / About, and roughly how much traffic
the site gets. This feature adds Google Analytics (GA4) page-view
tracking to every route so that usage data is available in a standard
Google Analytics property, informing future content and feature
decisions (e.g. which article categories or playlists to prioritise).

## Scope

**Note**: [CHG-015](../../changes/CHG-015-switch-to-google-tag-manager.md)
replaced the original direct-`gtag.js` loading mechanism described below
with Google Tag Manager. The sections in this spec have been updated to
describe the current (GTM-based) implementation; see CHG-015 for the
reasoning.

- Load Google Tag Manager (container `GTM-54ZWZN4W`) on every page of the
  site, via the standard GTM install snippet in `index.html`. GA4 (and any
  future tags) is configured as a tag *inside* the GTM container, in
  Tag Manager's own web UI — outside this codebase.
- Push a page-view event onto `window.dataLayer` for the initial page load
  and for every subsequent in-app navigation (the site uses a client-side
  router, so a route change does not trigger a full page reload / a new
  GTM container-load event on its own), so a GTM tag can be triggered off
  it.
- Centralise the page-view push behind a single service module, per
  `_specs/architecture.md` §18 (External Services), so components and
  routing code never touch `window.dataLayer` directly. The GTM *loader*
  itself is necessarily static markup in `index.html` (its `<noscript>`
  fallback only works as HTML), not something a service module can own.
- Make the GTM container ID configurable via a `VITE_`-prefixed
  environment variable, per architecture §20, rather than hard-coded —
  substituted into `index.html` via Vite's built-in HTML env replacement
  (`%VITE_GTM_CONTAINER_ID%`).

## Out of scope

- Custom/business event tracking (e.g. clicks on "Watch on YouTube",
  outbound clicks to Cults3D/Ko-fi/Tinkercad, form submissions on the
  Suggestions page). This spec covers page-view tracking only; event
  tracking can be proposed as a follow-up change once page views are in
  place.
- A cookie-consent banner or any consent-management UI. See Open
  questions — this is a real gap for a site with visitors "from all over
  the world" (`_specs/product.md`), but building consent UI is a
  separate, non-trivial feature and shouldn't be silently bundled into
  this one.
- A visible admin/analytics dashboard inside the site itself. Reporting
  happens in Google Analytics, not on DavesFunRC.com.
- Server-side or non-browser tracking (there is no server; per
  architecture §2 the site is static).
- Any other analytics provider.

## User stories

- As Dave (site owner), I want to see page-view counts and navigation
  patterns across all pages in Google Analytics, so I can tell which
  content resonates and prioritise future articles/videos accordingly.
- As Dave, I want tracking to keep working automatically as new pages
  are added to the site, without needing to remember to wire up
  analytics on every new route.
- As a site visitor, I want the site to load and behave exactly as
  before — analytics should be invisible and must not block or slow
  down my use of the site.

## User experience

No visible UI changes. Analytics loads silently in the background.

- On first load of any page (including deep links, e.g. landing directly
  on `/about`), a page view is recorded for that path once GA has
  loaded.
- When a visitor uses the in-app navigation (header nav, footer links,
  in-page links using the router) to move to another route, a page view
  is recorded for the new path — without a full browser reload.
  navigating to a nonexistent path (rendered via `NotFoundPage`) also
  reports a page view for that path, since it's a real UI state a
  visitor can land on/share.
  Browser back/forward (`popstate`) navigation also reports a page view,
  since `src/app/router.tsx`'s `RouterProvider` already treats `popstate`
  the same as an in-app navigation.
- If `VITE_GTM_CONTAINER_ID` is not configured (e.g. local development
  without a `.env`), the GTM snippet still attempts to load — pointed at
  the literal, unresolved `%VITE_GTM_CONTAINER_ID%` string — which simply
  fails as an invalid container id with no visible error to a visitor
  (see Edge cases). This differs from the previous direct-integration
  behaviour, which explicitly skipped loading anything when unconfigured;
  GTM's snippet has no equivalent conditional built in.

## Functional requirements

- FR-001: The application must load Google Tag Manager on every page, via
  the standard GTM `<script>`/`<noscript>` snippet in `index.html`, with
  the container ID configured via environment variable.
- FR-002: The container ID must be read from a `VITE_`-prefixed
  environment variable (`VITE_GTM_CONTAINER_ID`) and must never be
  hard-coded in source — substituted into `index.html` via Vite's HTML
  env replacement.
- FR-003: A page-view event must be pushed to `window.dataLayer` for the
  initial page load, using the current path.
- FR-004: A page-view event must be pushed to `window.dataLayer` on every
  subsequent client-side route change (in-app link navigation and browser
  back/forward), using the new path — without requiring a full page
  reload.
- FR-005: The page-view push must be isolated behind a single service
  module under `src/services/`. No component or routing file may touch
  `window.dataLayer` directly. (The GTM loader/`<noscript>` snippet itself
  is static markup in `index.html`, not something a service module can
  own — see Constraints.)
- FR-006: ~~When the Measurement ID is missing or empty, the service must
  no-op~~ — superseded by CHG-015. GTM's snippet has no conditional
  loading behaviour to mirror; an unset `VITE_GTM_CONTAINER_ID` results in
  the snippet attempting (and failing) to load an invalid container id,
  not a skipped load — see Edge cases. `trackPageView` itself still never
  throws, regardless of whether GTM loaded successfully.
- FR-007: GTM's loader script must not block initial page render (loaded
  asynchronously, per Google's standard snippet).
- FR-008: The 404 / unmatched-route state must also push a page-view
  event for the attempted path, since `_specs/architecture.md` treats
  routing as centralised and this is a real state visitors reach.

## Non-functional requirements

- **Privacy**: no personally identifiable information (name, email,
  Suggestions form content, etc.) may be passed into `dataLayer` pushes —
  only the page path. Any IP-address/consent handling is now whatever the
  site owner configures on the GA4 tag inside GTM, outside this
  codebase's control.
- **Security**: the GTM container ID is not a secret (container IDs are
  always exposed in client-side requests by design), so it is safe as a
  `VITE_` variable per architecture §20. No other credentials are
  involved.
- **Performance**: GTM's loader script must be loaded asynchronously so
  it does not delay first paint or block the main thread (built into
  Google's standard snippet); per architecture §23, no new npm dependency
  should be added when the standard snippet achieves the same result.
- **Accessibility**: not applicable — this feature has no visible UI.
- **Resilience**: if the GTM script fails to load (network failure,
  ad-blocker, etc.), the site must continue to function normally with no
  visible error, broken layout, or console error surfaced to the visitor
  — `trackPageView`'s `dataLayer.push` still succeeds even if GTM's
  script never arrives to process the queue.
- **Supportability**: the container ID must be documented in a root
  `.env.example` entry (see Expected changes) so a future maintainer
  knows the variable exists and where it's used, consistent with how the
  Latest Videos feature previously documented its `VITE_YOUTUBE_*`
  variables.

## Data requirements

No application data model changes. The only new "data" is configuration:

- `VITE_GTM_CONTAINER_ID` — string, format `GTM-XXXXXXX`, sourced from
  the site owner's Google Tag Manager container. Public (browser-exposed)
  by design, not a secret.

No data is persisted by the application itself; GTM/GA store event data
in Google's systems, outside this codebase's control. Which tags actually
fire off the `page_view` `dataLayer` event (e.g. a GA4 Configuration tag)
is configured in Tag Manager's own web UI, not in this codebase.

## Interfaces

- `src/services/analytics.service.ts` — the single integration point
  named directly in architecture §18's own example. Responsible only for:
  - Exposing a typed function `trackPageView(path: string): void` that
    the routing layer calls on navigation, which pushes
    `{ event: 'page_view', page_path: path }` onto `window.dataLayer`
    (initialising `dataLayer` first if GTM hasn't already).
- `index.html` — owns loading GTM itself: the standard loader `<script>`
  high in `<head>` (immediately after `<meta charset>`) and the
  `<noscript><iframe>` fallback immediately after the opening `<body>`
  tag, both referencing `%VITE_GTM_CONTAINER_ID%`. This is necessarily
  static markup rather than something `analytics.service.ts` injects —
  GTM's `<noscript>` fallback only has any value as real HTML present
  before any JavaScript runs.
- `src/main.tsx` — no longer touches analytics at all; there is nothing
  left to initialise from JavaScript once GTM's own snippet owns loading.
- `src/app/router.tsx` — unchanged by CHG-015. The existing
  `RouterProvider` already centralises every path change (initial
  `useState` value, and the `popstate`/`navigate` updates to `path`) and
  calls `analytics.trackPageView(path)` in a `useEffect` on `path`, for
  every route change including 404s, without duplicating tracking calls
  across every page component.

## Existing components to reuse

- `src/app/router.tsx`'s `RouterProvider` / `path` state — the existing
  centralised navigation point; no new routing logic needed.
- The Latest Videos feature's pattern for optional `VITE_`-prefixed
  config with graceful degradation
  (`src/features/videos/videos.service.ts`,
  `_specs/features/latest-videos/spec.md`) — same shape of problem
  (optional external-service config, absent in local dev), reused as
  the model for FR-006.
- No shared UI components are needed — this feature has no visible
  interface.

## Expected changes

_As originally implemented (`src/main.tsx` initialising `analytics.
service.ts`, which injected `gtag.js` directly) — superseded by
[CHG-015](../../changes/CHG-015-switch-to-google-tag-manager.md)._
Current state:

- `index.html` — GTM `<script>`/`<noscript>` snippets (CHG-015).
- `src/services/analytics.service.ts` — reduced to `trackPageView` only
  (CHG-015).
- `src/services/analytics.service.test.ts`
- `src/main.tsx` — no longer references analytics at all (CHG-015).
- `tests/unit/index.html.test.ts` — regression test for the GTM markup
  (CHG-015).
- Root `.env.example`, documenting `VITE_GTM_CONTAINER_ID` (CHG-015;
  originally documented `VITE_GA_MEASUREMENT_ID`).
- `.github/workflows/deploy-pages.yml` — forwards
  `VITE_GTM_CONTAINER_ID` (CHG-015; originally
  `VITE_GA_MEASUREMENT_ID`, added by
  [CHG-009](../../changes/CHG-009-ga-measurement-id-deploy-workflow.md)).
- `src/app/router.tsx` and its test — unchanged since the original
  implementation; `trackPageView(path)`'s contract never changed.
- No changes to `src/app/routes.ts`, `src/app/App.tsx`, shared layout
  components, or any individual page/feature component.

## Constraints

- Must not introduce a new npm dependency — GTM is loaded via a plain
  `<script>`/`<noscript>` snippet and a small service module, consistent
  with architecture §23/§29 ("A new dependency must not be introduced
  when a small local implementation would be clearer") and the precedent
  set by the Latest Videos feature (native `fetch`, no SDK). The official
  GTM snippet is the standard, Google-documented integration method and
  does not require an npm package.
- Must not modify the application shell (`App.tsx`), shared layout
  components, or routes/navigation structure — tracking hooks into the
  existing router, not into individual pages.
- Must comply with architecture §18: external services accessed only
  through a typed service module — with the caveat (see Interfaces) that
  GTM's loader/`<noscript>` fallback is unavoidably static HTML, not
  something a service module can inject.
- Must comply with architecture §20: the container ID is exposed via a
  `VITE_`-prefixed variable and treated as public.
- Local development and CI builds must succeed with no
  `VITE_GTM_CONTAINER_ID` set at all, though (unlike the original
  `gtag.js` implementation's FR-006 no-op) the GTM snippet will still
  attempt to load with a literal, unresolved placeholder id — see Edge
  cases.

## Edge cases

- **No container ID configured** (local dev without `.env`, or before
  the site owner sets the production secret): the GTM snippet still
  attempts to load `gtm.js?id=%VITE_GTM_CONTAINER_ID%` (an invalid id) —
  the request fails, no container loads, but `trackPageView`'s
  `dataLayer.push` still succeeds harmlessly into an array nothing reads.
  `npm run build`/`test` are unaffected either way.
- **GTM script blocked** (ad-blocker, network failure, offline visitor):
  `trackPageView` calls still push onto `window.dataLayer` — the push
  itself can never fail — they just have nothing downstream to process
  them; must not throw an unhandled error that could trip the app's
  `ErrorBoundary` (`src/components/layout/ErrorBoundary.tsx`) or log a
  visible console error.
- **Rapid navigation** (visitor clicks multiple nav links quickly): each
  path change fires its own page-view push; no debouncing is required.
- **Direct deep link / full page load on a non-home route** (e.g.
  sharing a link to `/videos`): still recorded correctly, since
  `trackPageView` fires from the router's initial state, not only on
  subsequent navigation.
- **Unknown route (404)**: still recorded, per FR-008, using the
  attempted path.
- **GTM tag/trigger configuration**: whether the `page_view` event this
  codebase pushes actually results in a GA4 hit depends entirely on the
  site owner configuring a matching Custom Event trigger (and a GA4 tag)
  inside the GTM container's own web UI — outside this codebase's
  control or verification. See CHG-015's Regression risks.

## Acceptance criteria

- Given a production build with `VITE_GTM_CONTAINER_ID` set, when
  `dist/index.html` is inspected, then it contains the GTM loader script
  in `<head>` and the `<noscript>` iframe after `<body>`, both with the
  real container id substituted in.
- Given a visitor loads any route directly (e.g. `/about`), then GTM
  loads and a `page_view` event with that path is pushed to
  `window.dataLayer`.
- Given a visitor navigates between routes using in-app navigation
  (header nav, footer links, or a `Button`/link using the router), then a
  new `page_view` event is pushed for each route reached, without a full
  page reload.
- Given a visitor uses browser back/forward, then a `page_view` event is
  pushed for the resulting path.
- Given a visitor navigates to a non-existent path, then a `page_view`
  event is pushed for that attempted path and `NotFoundPage` still
  renders normally.
- Given the GTM script fails to load, when a visitor navigates the site,
  then no error is thrown or surfaced, and the rest of the site
  continues to function normally.
- `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
  build` all pass.

## Open questions

- **Cookie consent**: `_specs/product.md` describes a global audience
  ("RC plane enthusiasts of all types from all over the world"), which
  may include EU/UK visitors subject to GDPR/ePrivacy consent
  requirements for analytics cookies. This spec deliberately does not
  include a consent banner (see Out of scope) — the site owner should
  confirm whether one is required/desired, either as a fast-follow
  feature or a decision to accept the risk for a small hobby site.
  Flagging rather than deciding, per this Skill's instruction not to
  invent missing business rules.
- ~~**GA property / Measurement ID**~~ — Resolved. The site owner
  supplied a GA4 Measurement ID (`G-HCTLCML1MF`) for davesfunrc.com.
- ~~**Where the production env var is set**~~ — Resolved by
  [CHG-009](../../changes/CHG-009-ga-measurement-id-deploy-workflow.md):
  `VITE_GA_MEASUREMENT_ID` is a GitHub Actions repo secret, forwarded to
  the build step in `.github/workflows/deploy-pages.yml`, the same
  mechanism used for `VITE_YOUTUBE_API_KEY`. (Originally implemented
  without this forwarding step, which meant the production build always
  inlined the variable as `undefined` and the minifier dead-code-
  eliminated the analytics script-loading logic entirely — no data
  reached Google Analytics until CHG-009 fixed it.)
- **"Tag never detected"**: Resolved by
  [CHG-015](../../changes/CHG-015-switch-to-google-tag-manager.md). The
  direct `gtag.js` integration above was confirmed technically working
  end-to-end (script loaded, `dataLayer` processed, events queued), but
  the site owner's actual verification method was Google Tag Manager,
  which was never installed on the site at all. CHG-015 replaced the
  direct integration with GTM (container `GTM-54ZWZN4W`, env var renamed
  to `VITE_GTM_CONTAINER_ID`, same GitHub-secret-forwarding mechanism as
  CHG-009 established). GA4 tracking itself now depends on the site owner
  completing setup inside the GTM web UI (see CHG-015's Out of scope) —
  not purely a code concern any more.

## Tests

- `src/services/analytics.service.test.ts`:
  - `trackPageView(path)` pushes `{ event: 'page_view', page_path: path
    }` onto `window.dataLayer`.
  - Initialises `window.dataLayer` itself if it doesn't already exist.
  - Appends to an existing `dataLayer` (e.g. GTM's own bootstrap entries)
    rather than replacing it.
- `tests/unit/index.html.test.ts`:
  - The GTM loader script is present in `<head>`, above `</head>` and
    after `<meta charset>`, referencing `%VITE_GTM_CONTAINER_ID%`.
  - The `<noscript>` iframe is present immediately after `<body>`,
    referencing the same placeholder.
  - No leftover reference to the retired `gtag` integration.
- `src/app/router.test.tsx` (unchanged by CHG-015):
  - Mounting `RouterProvider` triggers a tracked page view for the
    initial path.
  - Calling `navigate()` to a new path triggers a tracked page view for
    the new path.
  - A `popstate` event triggers a tracked page view for the resulting
    path.
  - Uses a mocked/spied `analytics.service` module — these tests don't
    depend on GTM's real script or network access.
- Full existing suite (`npm run test`) must continue to pass unchanged,
  confirming no regression to routing, layout, or page components.

## Completion

`_specs/feature-index.md` updated with this feature (Status: Specified)
as part of this same commit.
