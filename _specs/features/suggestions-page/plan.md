# Plan: Suggestions Page

## Existing components/patterns to reuse

- `components/ui/Button` — used as a plain `<Button type="submit">`
  inside a `<form onSubmit>`; no `href`, so none of the `isExternal()`/
  router-navigation logic is involved (sidesteps the class of bug hit on
  the Read feature's PDF links entirely, by construction).
- `AboutPage.tsx`/`AboutPage.css`'s `.about-page__intro` /
  `.about-page__portrait` pattern (132px circular portrait, flex row,
  stacks centered ≤560px) — this is a closer, more directly-applicable
  precedent than `HomePage.css`'s `.home-hero-row` cited in the spec's
  FR-007, since it already lays out this exact portrait image next to a
  paragraph. Mirrored under new `.suggestions-page__intro` /
  `.suggestions-page__portrait` classes (small page-scoped CSS, not
  extracted into a shared component — matching how `VideosPage.css`/
  `ReadPage.css` each define their own grid rather than sharing one).
- Design tokens (`--radius-input`, `--colour-border`, `--colour-error`,
  `--colour-accent`, spacing scale) for `FormField`/`SuggestionForm`.

## Files expected to change

- `src/features/suggestions/SuggestionsPage.tsx` — replace
  `PlaceholderPage` usage with real heading, intro (portrait + welcome
  copy), and `<SuggestionForm />`.
- `src/features/about/AboutPage.tsx` — update the portrait import path
  after the asset move.
- `_specs/feature-index.md` — mark `Implemented` with summary (on
  completion).

## New files

- `src/assets/brand/portrait.png` — moved from `src/assets/about/`
  via `git mv` (preserves history); used by both About and Suggestions
  now.
- `src/components/forms/FormField.tsx` + `.css` + `.test.tsx` — shared
  labelled-field wrapper (input or textarea), required-`*` marker,
  optional hint text, inline error message with `aria-describedby`.
  First component under `src/components/forms/` (directory didn't exist
  before this feature).
- `src/features/suggestions/suggestions.ts` + `.test.ts` — pure
  functions: `validateSuggestion({ name, feedback })` →
  `{ name?: string; feedback?: string }` error map, and
  `buildMailtoUrl({ name, country, feedback })` → the encoded
  `mailto:` URI (Country line omitted when blank). Mirrors the
  `buildArticles` pattern from the Read feature — logic-only, no
  `import.meta.glob`/DOM dependency, so it's trivially unit-testable.
- `src/features/suggestions/components/SuggestionForm.tsx` + `.css` +
  `.test.tsx` — owns the three fields' state, renders three
  `FormField`s, validates and navigates (`window.location.href =
  buildMailtoUrl(...)`) on submit.
- `src/features/suggestions/SuggestionsPage.css` — page padding/intro
  layout (new; the page had no dedicated stylesheet before).
- `src/features/suggestions/SuggestionsPage.test.tsx` — new (page
  previously had no test file).

## Data/API changes

None. No new types outside the feature-local `SuggestionFields`/
`SuggestionErrors` shapes in `suggestions.ts`. No network calls.

## Dependencies

None new.

## Tests to add or update

- `FormField.test.tsx`: renders label+input, label+textarea; shows
  required marker; shows hint text; shows/associates error message via
  `aria-describedby` when `error` is set; omits it when not.
- `suggestions.test.ts`: `validateSuggestion` — empty name/feedback
  (including whitespace-only) produce errors, valid input produces none;
  `buildMailtoUrl` — exact encoded output for the Sven/Sweden example
  from the spec, and the Country-blank case producing no "Country:"
  line.
- `SuggestionForm.test.tsx`: submit blocked + inline errors shown when
  Name/Feedback empty; valid submit sets `window.location.href` to the
  exact expected `mailto:` URI (test replaces `window.location` with a
  plain writable stub object before rendering, since jsdom doesn't
  support real cross-scheme navigation — this avoids depending on jsdom
  navigation internals at all).
- `SuggestionsPage.test.tsx`: heading renders; portrait renders with
  descriptive alt text; form fields present; no leftover "coming soon"
  placeholder text.
- `AboutPage.test.tsx`: existing suite re-run unchanged (alt text
  assertion, not import path, so the portrait move doesn't need a test
  change) — confirms the moved asset still resolves correctly.

## Risks

- Moving `portrait.png` could silently break `AboutPage` if the import
  path isn't updated in the same commit. Mitigation: `git mv` + import
  update land together; full suite + build run before commit.
- `window.location.href` assignment in jsdom can log a "Not implemented:
  navigation" warning (same category as the pre-existing benign
  `scrollTo` warnings already seen in this suite). Mitigation: stub
  `window.location` in the relevant test rather than letting jsdom
  attempt real navigation.

## Acceptance criteria mapping

- FR-001, FR-007 → `SuggestionsPage.test.tsx` (heading+intro+portrait
  replace placeholder).
- FR-002, FR-003 → `FormField.test.tsx` + `SuggestionForm.test.tsx`
  (required marker, blocked submit, inline errors).
- FR-004, FR-006 → `suggestions.test.ts` (`buildMailtoUrl` exact output,
  fixed subject).
- FR-005 → `SuggestionForm.test.tsx` (`window.location.href` set to the
  built URI on valid submit).
