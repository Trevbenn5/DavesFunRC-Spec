# CHG-007 — About page story

## Status

Proposed

## Requested change

Replace the About page's placeholder copy with a full multi-paragraph story
about Dave and the site — his return to the RC hobby via drone photography,
his budget-first philosophy, designing/3D-printing his own aircraft, the
local flying-club community, and why he shares it all via YouTube and this
site.

## Reason

The About page currently ships a single placeholder sentence
("The story of DavesFunRC and Dave from Downunder is coming soon."). The
site owner supplied the real copy and wants it live.

## Current behaviour

`src/features/about/AboutPage.tsx` renders the shared
`src/components/content/PlaceholderPage.tsx` component, which accepts a
`title` and a single `description` string and renders exactly one `<h1>`
and one `<p>`. `PlaceholderPage` is also used, unmodified, by
`ThreeDDesignsPage`, `SuggestionsPage`, `NotFoundPage`, and
`ErrorBoundary`.

## Desired behaviour

- The About route (`/about`) renders the supplied story as twelve short
  paragraphs under an `<h1>About</h1>`, using the site's existing body
  typography (Inter, 65ch paragraph measure, standard heading scale from
  `src/styles/typography.css`) — no new type scale, no new colours.
- `PlaceholderPage` itself is **not** modified — it doesn't support
  multiple paragraphs, and changing its props/behaviour would affect the
  four other consumers listed above, none of which need this. Instead,
  `AboutPage.tsx` stops using `PlaceholderPage` and renders its own content
  directly inside the same `.container` page shell every other route uses,
  matching the precedent already set when `VideosPage` moved off
  `PlaceholderPage` (see `_specs/feature-index.md`'s Latest Videos entry).
- No image, portrait, or mascot artwork is added in this change (see Out of
  scope) — text only, per the request.

See the before/after mockup:
https://claude.ai/code/artifact/e460b103-1087-4647-bee7-e160b66691ff

## Change classification

Content

## Affected specification

None. No feature specification exists for the About page (built during
scaffolding, not via `create-feature-spec`, and `_specs/product.md`'s About
entry is just "See section above" with no detail to reconcile).

## Affected implementation areas

- `src/features/about/AboutPage.tsx` — rewritten to render the story
  directly (own `<h1>` + paragraph list) instead of delegating to
  `PlaceholderPage`.
- New file: `src/features/about/AboutPage.css` — page-local styles limited
  to spacing between paragraphs, using existing `--space-*` tokens; no new
  colours, fonts, or breakpoints.
- No changes to `PlaceholderPage.tsx`/`.css`, routing
  (`src/app/routes.ts`), navigation, or any other page.

## Requirements

1. All twelve paragraphs of the supplied copy render in order, unedited,
   each as its own `<p>` (not line breaks inside one block), so screen
   readers and browser "find on page" behave normally.
2. Heading hierarchy stays a single `<h1>About</h1>` — no new `<h2>`/`<h3>`
   sections, matching the flowing-story tone of the copy (no natural
   section breaks were supplied).
3. Uses only existing typography/spacing tokens from
   `src/styles/typography.css` and `src/styles/tokens.css` — no new font,
   colour, or spacing value introduced.
4. Renders inside the same `.container` shell as every other route, so
   page width/padding stays consistent with the rest of the site at
   desktop, tablet, and mobile widths.
5. `PlaceholderPage.tsx` and its four other consumers are untouched and
   continue to render exactly as before.

## Acceptance criteria

- [ ] `/about` shows the H1 "About" followed by the twelve paragraphs from
      the mockup, in order, with no placeholder text remaining.
- [ ] Page is visually consistent with the rest of the site (spacing,
      type, colour) at desktop (~1280px), tablet (~768px), and mobile
      (~390px) widths, with no horizontal overflow.
- [ ] `ThreeDDesignsPage`, `SuggestionsPage`, `NotFoundPage`, and the
      error-boundary fallback are visually unchanged (still render via
      `PlaceholderPage` as before).
- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
      build` all pass.
- [ ] `tests/unit/App.test.tsx`'s existing About nav-link assertion
      continues to pass unmodified.

## Regression risks

- Low. The change is isolated to one feature file plus one new CSS file;
  no shared component, route, or navigation entry is touched, and no
  existing test asserts on the current placeholder text.
- Twelve consecutive `<p>` tags is more content than any other current
  page carries in one block — worth a quick visual check that spacing
  doesn't feel cramped at mobile widths, but no layout mechanism changes.

## Out of scope

- No image added. `assets/Me Circle.png` (a ready-made circular portrait
  of Dave) and the koala mascot mentioned in `_specs/design-system.md`'s
  Mascot section are both plausible About-page additions, but the request
  was text only — a natural follow-up change, not part of this one.
- No section headings, pull quotes, or other structural breakup of the
  copy beyond paragraph breaks.
- No change to `PlaceholderPage` or any of its other four consumers.
- No change to any other route or to navigation.

## Documentation updates

None required beyond this spec and the `change-index.md` entry — no
feature specification exists to update, and `implement-change` doesn't
touch `_specs/feature-index.md` (that's reserved for
`implement-feature`/`implement-change` on actual features, per CLAUDE.md's
Definition of done, and About isn't a tracked feature there).
