# Feature: Suggestions Page

## Purpose

`_specs/product.md` describes a "Suggestions Page - Space for the reader
to suggest future projects" as a core feature, and `/suggestions` already
exists as a route — but it currently renders `PlaceholderPage` with "A
place to suggest future projects is coming soon." This feature replaces
that placeholder with a real page: a welcoming introduction, and a small
form (Name, optional Country, and a Feedback/suggestion field) that
composes a `mailto:` message to Dave — no backend, no external form
service, no stored submissions.

## Scope

- Real content on the existing `/suggestions` route
  (`src/features/suggestions/SuggestionsPage.tsx`), replacing its current
  `PlaceholderPage` usage.
- A welcoming introduction along the lines of: "Hi, I'd welcome
  suggestions for future projects if you'd like to share them with me."
  (exact wording may be warmed up further — see Open questions.)
- A form with:
  - **Name** — required, single-line text.
  - **Country** — optional, single-line text ("so they can let me know
    where they are coming from").
  - **Feedback** — required, multi-line text (the suggestion itself).
- A single submit action ("Send suggestion" or similar) that, instead of
  calling any external API, builds a `mailto:trevbenn5@hotmail.com`
  link with a subject line and a body assembled from the three field
  values, then navigates the browser to it — opening the visitor's own
  email client with the message pre-filled, exactly as the earlier
  "mailto-only, no backend" decision for this feature specified, just
  with structured fields instead of a single static link.
- Example composed message body, from the user's own illustration:
  ```
  Name: Sven
  Country: Sweden
  Feedback: Hello, I'm from Sweden and enjoy indoor aviation due to our
  climate. I'd like to see you build a STOL aircraft with 4 motors.
  ```
  When Country is left blank, its line is omitted entirely (not left as
  an empty "Country: " line).

## Out of scope

- Any real network submission — no external form-submission service
  (e.g. Formspree), no custom backend, no database. The `mailto:`
  mechanism is the entire transport, unchanged from the original
  decision for this feature.
- Storing, listing, or moderating submitted suggestions anywhere in the
  app — suggestions arrive in Dave's email inbox, outside this codebase.
- Confirming that a suggestion was actually sent — `mailto:` only opens
  the visitor's mail client; the site cannot know whether they went on
  to actually send it (see Edge cases).
- Any change to `SiteHeader`, `SiteFooter`, `MainNavigation`, or other
  routes.
- Publishing the email address anywhere else on the site (e.g. footer,
  About page).

## User stories

- As a visitor with an idea for a future build or video, I want a simple
  form to describe my suggestion (and optionally say where I'm from), so
  I don't have to compose the whole message myself in my email client.
- As Dave, I want suggestions to land in my own inbox, already legible
  and consistently formatted (Name / Country / Feedback), without
  maintaining a form backend or submissions list.

## User experience

Visiting `/suggestions` shows a heading, a short welcoming introduction,
and a form with three fields: Name (required), Country (optional), and
Feedback (required, multi-line). Required fields are marked with "*" per
the site's form conventions. Submitting with a required field empty shows
an inline error below that field and does not proceed. Submitting with
Name and Feedback filled in (Country optional) builds a `mailto:` link
from the three values and navigates to it, which opens the visitor's
default email client with the message ready to review and send.

Because sending happens in the visitor's own email client, the page
cannot show a "message sent" confirmation — there is no follow-up network
call to succeed or fail. This is an accepted limitation of the `mailto:`
mechanism (see Edge cases), not a missing loading/success/error state.

## Functional requirements

- FR-001: `/suggestions` renders dedicated page content (heading +
  welcoming introduction + form) instead of `PlaceholderPage`.
- FR-002: The form has a required Name field, an optional Country field,
  and a required Feedback field (multi-line).
- FR-003: Required fields (Name, Feedback) show a "*" next to their label
  and, if left empty at submit time, show an inline error message below
  the field and block navigation to the `mailto:` link.
- FR-004: On valid submit, the app builds
  `mailto:trevbenn5@hotmail.com?subject=<encoded>&body=<encoded>` where
  the body is:
  ```
  Name: {name}
  Country: {country}      (this line omitted entirely if Country is blank)
  Feedback: {feedback}
  ```
  and both subject and body are URI-encoded (`encodeURIComponent`) so
  special characters/newlines in visitor input don't corrupt the link.
- FR-005: On valid submit, the browser navigates to the constructed
  `mailto:` URI (e.g. via `window.location.href` assignment inside the
  form's submit handler), opening the visitor's email client.
- FR-006: The subject line is a fixed string (e.g. "DavesFunRC
  suggestion") — not user-editable.

## Non-functional requirements

- Accessibility: every field has a visible label above it (per
  `_specs/design-system.md`'s Forms section); required fields are marked
  with "*" and this is not the only signal (accessible name/required
  state also exposed via `aria-required`); validation errors appear
  below the relevant field, associated via `aria-describedby`, and are
  not colour-only; all fields and the submit control are keyboard
  operable with a visible focus indicator; heading hierarchy starts at H1
  and doesn't skip levels.
- Privacy: the email address is placed directly in rendered HTML/JS as
  the `mailto:` target (a standard, accepted practice for this
  mechanism) — no obfuscation required. Field values (Name/Country/
  Feedback) exist only in local component state and the constructed
  `mailto:` URI; they are never sent to any server or third party by this
  codebase.
- Performance/dependencies: no new npm dependency, no new environment
  variable, no external service call — everything happens client-side
  with native form elements and string building.

## Data requirements

- No persistence. Feature-local component state only: `{ name: string;
  country: string; feedback: string }`, held for the lifetime of the
  page view, plus derived validation-error state per required field.

## Interfaces

- Existing route `/suggestions` is unchanged; only its rendered component
  changes.
- Modified: `src/features/suggestions/SuggestionsPage.tsx`.
- New: `src/features/suggestions/components/SuggestionForm.tsx` (+
  `.css`) — owns the form state, validation, and `mailto:` construction/
  navigation.
- New shared component: `src/components/forms/FormField.tsx` (+ `.css`)
  — this is the site's first form, and no `Input`/`FormField`-style
  component exists yet under `src/components/forms/` (an empty,
  currently-uncreated directory per `_specs/architecture.md` §5's target
  structure). `FormField` wraps a label, an `<input>` or `<textarea>`,
  the required-`*` marker, and an inline error message, so both text
  fields and the multi-line Feedback field share one accessible pattern.
  Future forms on this site should reuse it rather than each hand-
  rolling labelled inputs.
- No changes to `src/app/routes.ts`.

## Existing components to reuse

- `components/ui/Button` — used as a plain `type="submit"` button (no
  `href` prop), which renders its native `<button>` path and needs no
  workaround, unlike the earlier plain-mailto-anchor design this
  supersedes.
- The page-level layout pattern already used by `AboutPage.tsx`/
  `PlaceholderPage.tsx` (`<div className="container ...">`, `<h1>`,
  intro `<p>`).
- Design tokens from `src/styles/tokens.css` for field spacing, border
  radius (`--radius-input`), and error colour (`--colour-error`).

## Expected changes

- Modified: `src/features/suggestions/SuggestionsPage.tsx`,
  `src/features/suggestions/SuggestionsPage.test.tsx`.
- New: `src/features/suggestions/components/SuggestionForm.tsx` (+
  `.css`, `.test.tsx`), `src/components/forms/FormField.tsx` (+ `.css`,
  `.test.tsx`).
- No changes to `src/app/routes.ts` or any other page/component.

## Constraints

- No dependency on any external form/email-delivery service — `mailto:`
  only, per the user's explicit choice for this feature.
- The submit action must not render as an `<a href="mailto:...">`
  handled by `components/ui/Button`'s `href` prop — that path's
  `isExternal()` check requires a `//` after the scheme, which a
  `mailto:` URI never has, so `Button` would wrongly route it through the
  SPA router (the same class of bug already found and fixed in the Read
  feature's PDF links, see `_specs/features/how-to-articles/spec.md`).
  This design avoids the problem structurally: submission is a form
  `onSubmit` handler that assigns `window.location.href` directly, not a
  static anchor.

## Edge cases

- A required field (Name or Feedback) is empty at submit time: inline
  error shown, no navigation attempted (FR-003).
- Country is left blank: omitted from the composed message body
  entirely, not rendered as a blank line (see Scope).
- Visitor's device/browser has no email client configured: the
  `mailto:` navigation does nothing visible, or the OS/browser shows its
  own "no handler" prompt. No custom in-page fallback (e.g. displaying
  the raw address as copyable text) is in scope for this iteration.
- Visitor's Name, Country, or Feedback contains characters that would
  otherwise break a URI (`&`, `#`, newlines, emoji, etc.): handled by
  `encodeURIComponent` on the assembled subject/body (FR-004).
- Visitor submits, their mail client opens, but they close it without
  sending: the site has no way to detect this and shows no error — an
  accepted limitation of `mailto:` (see User experience).

## Acceptance criteria

- Given a visitor opens `/suggestions`, then they see a heading, a
  welcoming introduction, and a form with Name, Country, and Feedback
  fields, Name and Feedback marked as required.
- Given the visitor submits with Name or Feedback empty, then an inline
  error appears below the relevant field and no `mailto:` navigation
  occurs.
- Given the visitor fills in Name="Sven", Country="Sweden",
  Feedback="Hello, I'm from Sweden..." and submits, then the app
  navigates to a `mailto:trevbenn5@hotmail.com` URI whose decoded body is
  `Name: Sven\nCountry: Sweden\nFeedback: Hello, I'm from Sweden...`.
- Given the visitor fills in Name and Feedback but leaves Country blank
  and submits, then the composed body has no "Country:" line at all.
- Given the page renders, when checked against heading hierarchy,
  labelling, and focus-visibility rules, then it satisfies WCAG 2.2 AA
  per `_specs/design-system.md`.

## Open questions

- Exact wording of the welcoming introduction and field labels/
  placeholders is not prescribed beyond the user's own draft ("Hi, I'd
  welcome suggestions for future projects if you'd like to share them
  with me.") — implementation should warm that up slightly per the
  user's "feel free to make it more welcoming" instruction, and it can be
  refined further afterward as a Content fast-path edit.
- Whether to include the visitor's Name in the `mailto:` subject line
  (e.g. "DavesFunRC suggestion from Sven") vs. a fixed subject: left to
  implementation; FR-006 currently specifies a fixed subject for
  simplicity.

## Tests

- `FormField.test.tsx`: label association, required-`*` marker,
  conditional error message rendering with `aria-describedby`, works for
  both `<input>` and `<textarea>` variants.
- `SuggestionForm.test.tsx`: blocks submit and shows errors when Name/
  Feedback are empty; on valid submit with all three fields filled,
  navigates to the exact expected `mailto:` URI (asserted via a mocked
  navigation target, since real client-side navigation can't be observed
  in jsdom); Country-blank case produces a body with no "Country:" line.
- `SuggestionsPage.test.tsx`: heading and introduction render; form is
  present; no leftover reference to the old placeholder copy.
- Full existing suite must still pass: `npm run lint`, `npm run
  typecheck`, `npm run test`, `npm run build`.

## Completion

See `_specs/feature-index.md` for status tracking (updated by this Skill
to `Specified`; `implement-feature` will later update it to
`Implemented` with a full implementation summary).
