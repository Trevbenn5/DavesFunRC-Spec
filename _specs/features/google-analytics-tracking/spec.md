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

- Load Google Analytics (GA4) on every page of the site.
- Record a page-view event for the initial page load and for every
  subsequent in-app navigation (the site uses a client-side router, so a
  route change does not trigger a full page reload / new `gtag.js`
  page-load event on its own).
- Centralise the GA integration behind a single service module, per
  `_specs/architecture.md` §18 (External Services), so components and
  routing code never talk to `gtag`/`dataLayer` directly.
- Make the GA Measurement ID configurable via a `VITE_`-prefixed
  environment variable, per architecture §20, rather than hard-coded.
- Degrade gracefully (site works normally, nothing crashes, no page view
  is recorded) when the Measurement ID is not configured — mirroring the
  pattern already established by the Latest Videos feature for missing
  `VITE_YOUTUBE_*` config.

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
- If the Measurement ID is not configured (e.g. local development, or
  before the site owner sets the production value), the site functions
  identically but no GA script loads and no events are sent — same
  pattern as the Latest Videos error/missing-config handling, but
  silent rather than showing an error state, since analytics is not
  user-facing content.

## Functional requirements

- FR-001: The application must load the Google Analytics GA4 tag
  (`gtag.js`) on every page, only when a valid Measurement ID is
  configured via environment variable.
- FR-002: The Measurement ID must be read from a `VITE_`-prefixed
  environment variable (`VITE_GA_MEASUREMENT_ID`) and must never be
  hard-coded in source.
- FR-003: A page-view event must be recorded for the initial page load,
  using the current path.
- FR-004: A page-view event must be recorded on every subsequent
  client-side route change (in-app link navigation and browser
  back/forward), using the new path — without requiring a full page
  reload.
- FR-005: All GA-specific logic (script loading, `gtag`/`dataLayer`
  calls) must be isolated behind a single service module under
  `src/services/`. No component or routing file may call `gtag` or
  touch `window.dataLayer` directly.
- FR-006: When `VITE_GA_MEASUREMENT_ID` is missing or empty, the service
  must no-op (no script loaded, no events sent) and must not throw or
  log an error that a visitor would see. A `console.info`/`console.warn`
  in dev builds only is acceptable, matching existing project
  conventions if any are found during implementation.
- FR-007: GA script loading must not block initial page render (loaded
  asynchronously).
- FR-008: The 404 / unmatched-route state must also report a page view
  for the attempted path, since `_specs/architecture.md` treats routing
  as centralised and this is a real state visitors reach.

## Non-functional requirements

- **Privacy**: no personally identifiable information (name, email,
  Suggestions form content, etc.) may be passed into GA event
  parameters — only the built-in page path/location that `gtag.js`
  collects by default. GA4's default configuration already applies
  IP-address truncation/anonymisation; no additional configuration is
  required for that.
- **Security**: the Measurement ID is not a secret (GA Measurement IDs
  are always exposed in client-side requests by design), so it is safe
  as a `VITE_` variable per architecture §20. No other credentials are
  involved.
- **Performance**: the GA script must be loaded asynchronously/deferred
  so it does not delay first paint or block the main thread; per
  architecture §23, no new npm dependency should be added when loading
  the standard `gtag.js` `<script>` tag achieves the same result.
- **Accessibility**: not applicable — this feature has no visible UI.
- **Resilience**: if the GA script fails to load (network failure,
  ad-blocker, etc.), the site must continue to function normally with
  no visible error, broken layout, or console error surfaced to the
  visitor.
- **Supportability**: the Measurement ID must be documented in a root
  `.env.example` entry (see Expected changes) so a future maintainer
  knows the variable exists and where it's used, consistent with how
  the Latest Videos feature previously documented its `VITE_YOUTUBE_*`
  variables.

## Data requirements

No application data model changes. The only new "data" is configuration:

- `VITE_GA_MEASUREMENT_ID` — string, format `G-XXXXXXXXXX`, sourced from
  the site owner's Google Analytics 4 property. Public (browser-exposed)
  by design, not a secret.

No data is persisted by the application itself; GA stores event data in
Google's systems, outside this codebase's control.

## Interfaces

- New service: `src/services/analytics.service.ts` — the single
  integration point named directly in architecture §18's own example
  (`src/services/analytics.service.ts`). Responsible for:
  - Reading `import.meta.env.VITE_GA_MEASUREMENT_ID`.
  - Lazily injecting the `gtag.js` `<script>` tag and initialising
    `window.dataLayer`/`gtag` exactly once, only if a Measurement ID is
    present.
  - Exposing a typed function (e.g. `trackPageView(path: string): void`)
    that the routing layer calls on navigation.
- Modified: `src/main.tsx` — initialise the analytics service once at
  startup, alongside the other "approved application-wide services"
  architecture §6 explicitly calls out as `main.tsx`'s responsibility.
- Modified: `src/app/router.tsx` — the existing `RouterProvider` already
  centralises every path change (initial `useState` value, and the
  `popstate`/`navigate` updates to `path`). This is the single place
  a `useEffect` on `path` can call `analytics.trackPageView(path)` for
  every route change, including 404s, without duplicating tracking
  calls across every page component.

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

- New: `src/services/analytics.service.ts`
- New: `src/services/analytics.service.test.ts`
- Modified: `src/main.tsx` (initialise the service)
- Modified: `src/app/router.tsx` (call `trackPageView` on path change)
- Modified: `src/app/router.tsx`'s existing test file, if one exists, or
  a new test alongside it, to cover the tracking call
- New: root `.env.example`, documenting `VITE_GA_MEASUREMENT_ID`
  (the file was removed from the repo on 2026-07-24 during the scaffold
  rebuild — this feature reintroduces it for this variable)
- No changes to `src/app/routes.ts`, `src/app/App.tsx`, shared layout
  components, or any individual page/feature component.

## Constraints

- Must not introduce a new npm dependency — `gtag.js` is loaded via a
  plain `<script>` tag and the small wrapper service, consistent with
  architecture §23/§29 ("A new dependency must not be introduced when a
  small local implementation would be clearer") and the precedent set
  by the Latest Videos feature (native `fetch`, no SDK).
  the official `gtag.js` snippet is the standard, Google-documented
  integration method and does not require an npm package.
- Must not modify the application shell (`App.tsx`), shared layout
  components, or routes/navigation structure — tracking hooks into the
  existing router, not into individual pages.
- Must comply with architecture §18: external services accessed only
  through a typed service module.
- Must comply with architecture §20: the Measurement ID is exposed via
  a `VITE_`-prefixed variable and treated as public.
- Local development and CI builds must succeed with no
  `VITE_GA_MEASUREMENT_ID` set at all (see FR-006).

## Edge cases

- **No Measurement ID configured** (local dev, CI, or before the site
  owner sets the production secret): service no-ops entirely; no script
  tag is injected; `npm run build`/`test` are unaffected.
- **GA script blocked** (ad-blocker, network failure, offline visitor):
  `trackPageView` calls become no-ops once `gtag` fails to load; must
  not throw an unhandled error that could trip the app's
  `ErrorBoundary` (`src/components/layout/ErrorBoundary.tsx`) or log a
  visible console error.
- **Rapid navigation** (visitor clicks multiple nav links quickly):
  each path change fires its own page-view call; no debouncing is
  required since GA is designed to handle this.
- **Direct deep link / full page load on a non-home route** (e.g.
  sharing a link to `/videos`): still recorded correctly, since
  `trackPageView` fires from the router's initial state, not only on
  subsequent navigation.
- **Unknown route (404)**: still recorded, per FR-008, using the
  attempted path.
- **Duplicate initialisation** (e.g. React/Preact StrictMode-style
  double-invoke in dev, or hot-module-reload during `npm run dev`): the
  service must guard against injecting the `gtag.js` script or
  re-initialising `dataLayer` more than once per page load.

## Acceptance criteria

- Given `VITE_GA_MEASUREMENT_ID` is set to a valid ID, when a visitor
  loads any route directly (e.g. `/about`), then the GA script loads
  and a page-view event is recorded for that path.
- Given `VITE_GA_MEASUREMENT_ID` is set, when a visitor navigates
  between routes using in-app navigation (header nav, footer links, or
  a `Button`/link using the router), then a new page-view event is
  recorded for each route reached, without a full page reload.
- Given `VITE_GA_MEASUREMENT_ID` is set, when a visitor uses browser
  back/forward, then a page-view event is recorded for the resulting
  path.
- Given `VITE_GA_MEASUREMENT_ID` is set, when a visitor navigates to a
  non-existent path, then a page-view event is recorded for that
  attempted path and `NotFoundPage` still renders normally.
- Given `VITE_GA_MEASUREMENT_ID` is unset or empty, when the site is
  built and run, then no GA script is requested, no console errors
  appear, and every existing page/feature test still passes unchanged.
- Given the GA script fails to load, when a visitor navigates the site,
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
- **GA property / Measurement ID**: this spec assumes the site owner
  will create (or already has) a GA4 property for davesfunrc.com and
  will supply the `G-XXXXXXXXXX` Measurement ID as deployment
  configuration. Not something this spec can determine.
- **Where the production env var is set**: the project has no CI/CD
  pipeline wired up yet beyond what architecture §27 describes in
  principle (GitHub Actions deploying to GitHub Pages). Whoever runs
  `implement-feature` will need to confirm how `VITE_GA_MEASUREMENT_ID`
  reaches the production build (GitHub Actions secret/variable, or a
  local `.env.production` not committed to source) — likely the same
  mechanism already decided (or still pending) for
  `VITE_YOUTUBE_API_KEY`.

## Tests

- `src/services/analytics.service.test.ts`:
  - Does not inject a script tag or call `gtag` when
    `VITE_GA_MEASUREMENT_ID` is unset/empty.
  - Injects exactly one `gtag.js` script tag when a valid Measurement
    ID is present, even if the init function is called more than once
    (duplicate-initialisation guard).
  - `trackPageView(path)` calls `gtag('event', 'page_view', ...)` (or
    equivalent) with the given path once initialised.
  - `trackPageView(path)` is a safe no-op when analytics was never
    initialised (no Measurement ID).
- `src/app/router.test.tsx` (new, or extend an existing router test if
  one is found during implementation):
  - Mounting `RouterProvider` triggers a tracked page view for the
    initial path.
  - Calling `navigate()` to a new path triggers a tracked page view for
    the new path.
  - A `popstate` event triggers a tracked page view for the resulting
    path.
  - Use a mocked/spied `analytics.service` module — these tests must
    not depend on the real `gtag.js` script or network access.
- Full existing suite (`npm run test`) must continue to pass unchanged,
  confirming no regression to routing, layout, or page components.

## Completion

`_specs/feature-index.md` updated with this feature (Status: Specified)
as part of this same commit.
