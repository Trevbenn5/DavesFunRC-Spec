# CHG-010 — Store the Home weekly update content as Markdown

## Status

Proposed

## Requested change

Convert the Home Page Weekly Update feature's content source from a
TypeScript literal (`src/data/home-weekly-update.ts`) to a Markdown file
(`src/data/home-weekly-update.md`), so the site owner edits plain Markdown
instead of a TypeScript object literal.

## Reason

The Home Page Weekly Update feature (`_specs/features/home-weekly-update/spec.md`)
already commits to the site owner editing this content himself, weekly, as
a Content fast-path edit. A `.md` file with a heading line and paragraphs
is a more natural authoring surface for prose than a TS array of quoted,
comma-separated strings — fewer syntax pitfalls (unescaped quotes, missing
commas) for a non-code file format that's meant to be touched every week.

## Current behaviour

`src/data/home-weekly-update.ts` exports a typed literal:

```ts
export interface HomeWeeklyUpdate {
  heading: string;
  body: string[];
}

export const homeWeeklyUpdate: HomeWeeklyUpdate = {
  heading: "What's Dave working on this week?",
  body: ["...", "...", "..."],
};
```

`WeeklyUpdate.tsx` imports `homeWeeklyUpdate` directly from this module and
renders `heading` as an H2 and each `body` entry as a paragraph.

## Desired behaviour

`src/data/home-weekly-update.md` becomes the edited file:

```md
# What's Dave working on this week?

Hello, this week I'm working on finishing my MKVI Canberra Bomber. This
version has a larger body and wing cord. I've also made nicer undercarriage
for it and fitted new 30mm EDF's. The new receiver with differential
brushed ESC's blew up after a day, so I've ordered another one.

I'm also learning how to fly my MKVI Chaotic 3D flyer in the park and at
indoor aviation. This little number is a lot of fun.

Check out my construction and flight videos for these two planes.
```

Convention (documented as a comment at the top of the parser, and in the
feature spec):

- The first line must be a single `#` (H1) heading — becomes `heading`.
- Every remaining blank-line-separated block becomes one `body` paragraph,
  in order.
- No other Markdown syntax (bold, links, lists, nested headings) is
  rendered — the body is displayed as plain text, exactly as today. Any
  Markdown formatting characters typed into a paragraph appear literally.

`src/data/home-weekly-update.ts` is rewritten from a literal into a small
loader: it imports the `.md` file's raw text via Vite's built-in `?raw`
import suffix (no new dependency — see `_specs/architecture.md` §17, which
already lists "Markdown processed at build time" as an approved static
content form, and §29's preference against adding a dependency when a
small local implementation is clearer) and parses it into the same
`HomeWeeklyUpdate` shape:

```ts
import rawContent from './home-weekly-update.md?raw';

export interface HomeWeeklyUpdate {
  heading: string;
  body: string[];
}

function parseWeeklyUpdate(markdown: string): HomeWeeklyUpdate {
  const [headingBlock, ...bodyBlocks] = markdown
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return {
    heading: headingBlock.replace(/^#\s*/, ''),
    body: bodyBlocks,
  };
}

export const homeWeeklyUpdate: HomeWeeklyUpdate = parseWeeklyUpdate(rawContent);
```

`homeWeeklyUpdate` keeps the exact same shape and the exact same import
path (`src/data/home-weekly-update`), so `WeeklyUpdate.tsx`,
`WeeklyUpdate.test.tsx`, and `HomePage.test.tsx` require no changes.

A new ambient module declaration is needed for the `?raw` suffix on `.md`
files (Vite's shipped types cover common asset suffixes but not
`*.md?raw` specifically) — added to `src/vite-env.d.ts`:

```ts
declare module '*.md?raw' {
  const content: string;
  export default content;
}
```

## Change classification

Existing-feature enhancement

## Affected specification

`_specs/features/home-weekly-update/spec.md` — Data requirements and
Interfaces sections need updating to describe the `.md` file as the
edited source of truth and `home-weekly-update.ts` as a parser, not a
literal.

## Affected implementation areas

- `src/data/home-weekly-update.ts` (feature area: Home Page Weekly Update)
- `src/vite-env.d.ts` (shared ambient types)

No shared component, route, or other page is touched.

## Requirements

- New file `src/data/home-weekly-update.md` holding the current heading
  and body content, following the heading-then-paragraphs convention
  above.
- `src/data/home-weekly-update.ts` rewritten to import that file via
  `?raw` and parse it into the existing `HomeWeeklyUpdate` shape
  (`{ heading: string; body: string[] }`) — the exported identifier name,
  type name, and shape must not change.
- `src/vite-env.d.ts` gains the `*.md?raw` ambient module declaration.
- No new npm dependency.
- `WeeklyUpdate.tsx` and its existing tests are not modified.
- A small unit test for the new parse behaviour (heading extraction,
  paragraph splitting, trimming) — e.g. `src/data/home-weekly-update.test.ts`.

## Acceptance criteria

- Given `src/data/home-weekly-update.md`'s first line is `# <heading text>`,
  when the app builds, then `homeWeeklyUpdate.heading` equals `<heading text>`
  with no leading `#` or surrounding whitespace.
- Given the `.md` file has one or more blank-line-separated paragraphs
  after the heading, when the app builds, then `homeWeeklyUpdate.body` is
  an array with one string per paragraph, in file order, with no leading/
  trailing whitespace.
- Given the site owner edits only paragraph text in the `.md` file and
  rebuilds, then the Home page reflects the new text with no other file
  needing to change — matching the existing feature spec's Content
  fast-path guarantee.
- `WeeklyUpdate.test.tsx` and `HomePage.test.tsx` pass unmodified.
- `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`
  all pass.

## Regression risks

Low. The parser is a pure function over a build-time string with a
single, documented convention; if the `.md` file's first line isn't a `#`
heading, `heading` would simply retain any stray `#`-stripping mismatch
rather than throwing — acceptable given the original feature also has no
runtime validation for a malformed data file (same trust-the-editor stance
as the current TS literal, which would just fail to compile on a syntax
error). Malformed Markdown here fails differently (silently wrong content
rather than a build error), which is the main behavioural trade-off of
this change and is called out in the feature spec update rather than
solved with added validation logic.

## Out of scope

- Rendering Markdown formatting (bold, italic, links, lists) in the body
  text — out of scope; body remains plain text exactly as displayed today.
- A history/archive of past updates — unchanged from the existing feature
  spec's Out of scope.
- Any change to the fixed image, `WeeklyUpdate.tsx` markup/CSS, or any
  other page.
- Adding a Markdown-parsing dependency (`marked`, `remark`, etc.) — the
  heading/paragraph convention needed here doesn't warrant one.

## Documentation updates

- `_specs/features/home-weekly-update/spec.md` — Data requirements and
  Interfaces sections updated to describe the Markdown file as the edited
  source of truth (done as part of `implement-change`, per `CLAUDE.md`'s
  Definition of done).
- `_specs/change-index.md` — new row for this change.
