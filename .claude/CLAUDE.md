# Project instructions

## Development approach

This project uses incremental, specification-driven development.

The existing application scaffold, architecture, shared layout, navigation,
design system and reusable components are persistent project assets.

Do not recreate, replace or reinitialise the application scaffold when
implementing a feature.

## Sources of truth

Read these files before planning or implementing changes:

1. `_specs/product.md`
2. `_specs/architecture.md`
3. `_specs/design-system.md`
4. `_specs/static-assets/`
4. The relevant file under `_specs/features/`
5. Existing source code and tests

The existing source code is the source of truth for the current implementation.
Feature specifications describe intentional additions or changes.

## Determine work type category

Ask yourself:

1. Does the requested behaviour already exist?
   - Yes → Change
   - No → Feature

2. Is the request modifying existing content, business rules, UI, integrations, or workflows?
   - Yes → Change

3. Is it introducing entirely new user-facing or system capability?
   - Yes → Feature

If uncertain, ask the user before continuing.

## Change rules

**Any change to existing functionality (Category='Change') MUST go through the create-change-spec Skill first, with no exceptions, except pure content edits that qualify for the Content fast path below — those skip create-change-spec entirely. Do not implement any code changes until requested to do so by the user.**

For each new feature to be created:

- Inspect the existing implementation before proposing changes.
- Reuse existing layouts, components, utilities, services and conventions.
- Change only files required by the feature.
- Do not regenerate project configuration or application-wide files unless
  the feature explicitly requires an architectural change.
- Do not replace working components merely to make them stylistically different.
- Preserve existing routes and behaviour unless the specification explicitly
  changes them.
- Identify shared-component changes before making them.
- Run the relevant tests, linting and type checking after implementation.

## Change specification thresholds

This section decides how a Category='Change' request is handled: full
change specification, or Content fast path (see below). It does not create
a third, informal option — anything that isn't pure content still requires
`create-change-spec`.

A full change specification is required when a request:

- Changes user-visible behaviour
- Changes validation or business rules
- Changes data structures
- Affects more than one component
- Affects a shared component
- Introduces a new dependency
- Changes the design system
- Creates meaningful regression risk

The Content fast path applies instead of `create-change-spec` when a
request is purely:

- Correcting text
- Replacing an image
- Updating contact details
- Fixing a clear typo
- Changing metadata with no behavioural impact

If a request mixes a content edit with anything from the full-spec list
above (e.g. a text change that also touches a shared component), treat it
as a full change and run `create-change-spec`.

A rollback of a change that was implemented via a full `CHG-*.md` change
specification must itself go through `create-change-spec` and get its own
`CHG-*` entry, even when the rollback content itself is pure text/copy —
this preserves a paired record of the original change and its reversal. A
rollback of a Content fast-path edit may itself use the fast path.

## Content fast path

For requests that qualify under Change specification thresholds:

1. Confirm the request is content-only — no behaviour, structure, or
   shared-component change — and that it is not a rollback of a change
   that has its own `CHG-*.md` spec (see Change specification thresholds).
2. Make the edit directly in the relevant file. Do not create a
   `_specs/changes/CHG-*.md` file and do not run `create-change-spec` or
   `implement-change`.
3. Run the relevant checks (lint/typecheck/test/build) for the touched
   area.
4. Record the edit in `_specs/content-log.md` (create it if it doesn't
   exist yet), one dated bullet per edit. When several content edits are
   made together in the same request, batch them under a single dated
   entry (as sub-bullets) rather than creating a separate entry per edit.
5. Commit directly to `main` — no branch (see Branching strategy).
6. The fast path shortens process, not approval — still do not implement
   until the user has explicitly asked for the change to be made.

## Branching strategy

Every feature and change follows a short-lived branch model. This section is
the source of truth; the `create-feature-spec`, `create-change-spec`,
`implement-feature`, `implement-change`, and `deploy` Skills must follow it
rather than defining their own branching rules.

### When to branch

- **Features** always get a branch. No exceptions.
- **Changes** get a branch unless the change qualifies for the **Content
  fast path** (see Change specification thresholds) — those stay on
  `main`.

### Naming convention

- Features: `features/<slug>`
- Changes: `changes/<slug>`
- `<slug>` is derived from the feature or change title: lowercase, kebab-case,
  `a-z`/`0-9`/`-` only, max 40 characters.
- If the branch name is taken, append a version suffix: `changes/card-component-01`.

### Dirty working tree

Before creating a branch, check git status. If there are uncommitted,
unstaged, or untracked changes:

- Stop.
- Tell the user to commit or stash them.
- Do not auto-commit unrelated work under a feature or change commit.

### Branch lifecycle ownership

- The `implement-feature` and `implement-change` Skills own the full branch
  lifecycle: verify (lint/typecheck/test/build), commit, merge to `main`,
  then delete the branch. This happens once, at the end of implementation —
  no other Skill merges or deletes branches.
- `deploy` never manages branches. It assumes `main` is already up to date
  and only builds and pushes from `main`.
- Branches are local only. Nothing is pushed to `origin` and no pull request
  is opened before merging to `main`.

## Architectural changes

If a feature appears to require changing the application architecture:

1. Stop before implementing the architectural change.
2. Record the proposed decision in the feature plan.
3. Explain why the current architecture cannot support the feature.
4. Identify the affected features and shared components.
5. Implement the change only after it is explicitly accepted.

## Definition of done

A feature is complete only when:

- Its acceptance criteria are satisfied.
- Relevant automated tests pass.
- Existing behaviour has not regressed.
- The implementation follows the existing design system.
- The feature specification reflects any accepted changes.
- `_specs/feature-index.md` is updated.
