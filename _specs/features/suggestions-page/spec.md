# Feature: Suggestions Page

## Purpose

`_specs/product.md` describes a "Suggestions Page - Space for the reader
to suggest future projects" as a core feature, and `/suggestions` already
exists as a route — but it currently renders `PlaceholderPage` with "A
place to suggest future projects is coming soon." This feature replaces
that placeholder with real content: a page explaining what kinds of
suggestions Dave welcomes and a direct way to send one, by emailing him.

## Scope

- Real content on the existing `/suggestions` route
  (`src/features/suggestions/SuggestionsPage.tsx`), replacing its current
  `PlaceholderPage` usage.
- A short explanation of the page's purpose (inviting build/video/
  project ideas) in the site's established informal tone.
- A single call-to-action: a `mailto:` link addressed to
  `trevbenn5@hotmail.com`, pre-filled with a subject line, that opens the
  visitor's own email client with a suggestion addressed to Dave.

## Out of scope

- Any in-browser form, validation, or submission handling — no form
  fields, no external form-submission service (e.g. Formspree), no
  client-side state. `mailto:` is the entire mechanism.
- Storing, listing, or moderating submitted suggestions anywhere in the
  app — suggestions arrive in Dave's email inbox, outside this codebase.
- Any change to `SiteHeader`, `SiteFooter`, `MainNavigation`, or other
  routes.
- Publishing the email address anywhere else on the site (e.g. footer,
  About page) — this feature only wires it into the Suggestions page's
  call-to-action.

## User stories

- As a visitor with an idea for a future build or video, I want a clear,
  low-friction way to tell Dave about it, so I don't have to hunt for a
  contact method.
- As Dave, I want suggestions to land directly in my own inbox without
  maintaining a separate form backend or submissions list.

## User experience

Visiting `/suggestions` shows a heading and a short paragraph explaining
that Dave welcomes ideas for future builds, videos or projects. Below
that, a clearly labelled button/link ("Suggest an idea" or similar) is
the page's single call to action. Clicking it opens the visitor's default
email client with a new message already addressed to
`trevbenn5@hotmail.com` and a pre-filled subject line (e.g. "DavesFunRC
suggestion"), ready for the visitor to write their idea and send.

If the visitor's device/browser has no email client configured, no
in-page fallback is provided — this is an accepted limitation of the
`mailto:` mechanism (see Constraints and Edge cases).

## Functional requirements

- FR-001: `/suggestions` renders dedicated page content (heading +
  explanatory copy) instead of `PlaceholderPage`.
- FR-002: The page shows exactly one call-to-action: a link with
  `href="mailto:trevbenn5@hotmail.com?subject=DavesFunRC%20suggestion"`.
- FR-003: The call-to-action is a plain anchor element (or a component
  that renders one directly), not routed through `components/ui/Button`'s
  `href` handling — see Constraints.
- FR-004: The link's accessible name clearly states its action and
  destination (e.g. "Suggest an idea by email").

## Non-functional requirements

- Accessibility: the call-to-action is keyboard-focusable with a visible
  focus indicator; heading hierarchy starts at H1 and doesn't skip
  levels; WCAG 2.2 AA contrast on all text.
- Privacy: the email address is placed directly in rendered HTML markup
  (a standard, accepted practice for `mailto:` links elsewhere on the
  site's dependent architecture) — no obfuscation is required by this
  spec, and no other page gains a copy of the address (per Out of scope).
- Performance/dependencies: no new npm dependency, no new environment
  variable, no external service call.

## Data requirements

None — no form fields, no persisted or transmitted structured data. The
subject line text is a static string baked into the `mailto:` href.

## Interfaces

- Existing route `/suggestions` is unchanged; only its rendered component
  changes.
- Modified: `src/features/suggestions/SuggestionsPage.tsx` (+ a
  `SuggestionsPage.css` if needed for spacing beyond the shared
  `.container` utility).
- No new routes, services, or shared components.

## Existing components to reuse

- The page-level layout pattern already used by `AboutPage.tsx`/
  `PlaceholderPage.tsx` (`<div className="container ...">`, `<h1>`,
  `<p>` copy) — no new layout primitive needed.
- Design tokens from `src/styles/tokens.css` for any button-like styling
  applied directly to the anchor (e.g. matching `.button.button--primary`
  visual treatment via a shared class, without going through the
  `Button` component itself — see Constraints).

## Expected changes

- Modified: `src/features/suggestions/SuggestionsPage.tsx`,
  `src/features/suggestions/SuggestionsPage.test.tsx` (new/updated).
- Possible new: `src/features/suggestions/SuggestionsPage.css` (only if
  the existing `.placeholder-page`-style spacing isn't sufficient).
- No changes to `src/app/routes.ts` (route already exists and is
  unaffected) or any other page/component.

## Constraints

- `components/ui/Button`'s `isExternal()` check
  (`/^([a-z]+:)?\/\//i`) requires a `//` after the scheme to treat an
  `href` as external. A `mailto:` URI has no `//`, so `Button` would
  treat it as an internal path and route it through the SPA router's
  `navigate()` — breaking the mailto link exactly the way `Button` broke
  the Read feature's PDF links (see
  `_specs/features/how-to-articles/spec.md`'s Constraints). The
  call-to-action must be a plain `<a href="mailto:...">`, not `Button`
  used as-is.
- No dependency on any external form/email-delivery service — `mailto:`
  only, per the user's explicit choice for this feature.

## Edge cases

- Visitor has no email client configured on their device: the `mailto:`
  link simply does nothing visible or shows the OS/browser's own "no
  handler" prompt. No custom fallback (e.g. displaying the raw address as
  copyable text) is in scope for this iteration — acceptable per Out of
  scope and the user's chosen mechanism.
- Visitor is on a shared/public computer and doesn't want to open a mail
  client: no alternative contact method is provided by this feature.

## Acceptance criteria

- Given a visitor opens `/suggestions`, then they see a heading, an
  explanatory paragraph, and exactly one call-to-action link.
- Given the call-to-action link, when its `href` is inspected, then it
  equals `mailto:trevbenn5@hotmail.com?subject=DavesFunRC%20suggestion`.
- Given a visitor activates the call-to-action by mouse or keyboard, then
  their default mail client opens (verified in this codebase via the
  link's `href`/accessible name, since actually launching a mail client
  is outside what an automated test can assert).
- Given the page renders, when checked against heading hierarchy and
  focus-visibility rules, then it satisfies WCAG 2.2 AA per
  `_specs/design-system.md`.

## Open questions

- Exact wording of the explanatory copy and call-to-action label is not
  prescribed here — implementation should draft plain, low-key copy
  consistent with the site's tone (see `_specs/design-system.md`'s "low-
  key, friendly, informal" guidance) and can be refined by the site owner
  afterward as a Content fast-path edit.
- Whether to eventually publish the email address elsewhere (footer,
  About page) is explicitly deferred — Out of scope for this feature.

## Tests

- `SuggestionsPage.test.tsx`: heading renders; call-to-action link has
  the exact expected `mailto:` href; link has a clear accessible name;
  no leftover reference to the old placeholder copy.
- Full existing suite must still pass: `npm run lint`, `npm run
  typecheck`, `npm run test`, `npm run build`.

## Completion

See `_specs/feature-index.md` for status tracking (updated by this Skill
to `Specified`; `implement-feature` will later update it to
`Implemented` with a full implementation summary).
