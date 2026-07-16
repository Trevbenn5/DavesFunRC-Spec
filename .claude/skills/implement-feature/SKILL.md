---
name: implement-feature
description: Implement one approved feature specification incrementally within
  the existing website without recreating the scaffold.  Use if work type Category="Feature".
argument-hint: "[feature-slug or path to feature specification]"
disable-model-invocation: true
---

# Implement a specified feature

Implement the feature described by:

$ARGUMENTS

If the argument is a feature slug (e.g. `new-contact-form`) rather than a file path,
resolve it to its specification file by matching that slug against the
filenames in `_specs/features/` (there should be exactly one match). If none
or more than one file matches, stop and ask the user to disambiguate.

## Preconditions

Before changing code:

1. Check git status; if the working tree is dirty, stop and tell the user
   to commit or stash first (per CLAUDE.md's Dirty working tree rule).
   Then create the feature branch (`features/<slug>`, per CLAUDE.md's
   Branching strategy) from up-to-date `main` — the spec was committed to
   `main` by `create-feature-spec`, not to a branch, so this Skill is the
   one that creates it.
2. Read `CLAUDE.md`.
3. Confirm `_specs/scaffold-status.md` exists.
4. Read the supplied feature specification.
5. Inspect the relevant existing implementation.
6. Confirm that the specification has testable acceptance criteria.
7. Check for unresolved open questions that prevent implementation.

Do not regenerate the application scaffold.

## Planning

Create or update:

`_specs/features/<feature-slug>/plan.md`

The plan must identify:

- Existing components to reuse
- Files expected to change
- New files expected
- Data or API changes
- Tests to add or update
- Dependencies
- Risks
- Acceptance criteria mapping

Prefer extending existing code over replacing it.

## Change boundaries

Implement the smallest coherent change that satisfies the specification.

Do not:

- Recreate the project
- Replace the framework
- Rewrite unrelated components
- Modify unrelated routes
- Change global styling unnecessarily
- Introduce a new library when an existing dependency is sufficient
- Implement requirements not present in the specification

If an architectural change is required, stop and document it in `plan.md`
before making that change.

## Implementation

Implement requirements in traceable units.

Where useful, reference requirement identifiers in:

- Test names
- Code comments for non-obvious rules
- Commit descriptions
- Plan status

## Verification

Run:

- Feature tests
- Relevant integration tests
- Existing regression tests
- Type checking
- Linting
- Production build

Verify each acceptance criterion.

## Completion

Update `_specs/feature-index.md`:

- Status: Implemented
- Implementation summary
- Relevant test locations

Do not mark the feature complete when acceptance criteria remain unmet.

**If any tests fail, fix the implementation or the tests.**

**Do not procede to commit if there is broken code.**

## Commit and close out the branch

Commit any new or updated files with a message like:
Add feature specification for <feature_title>

Then follow the Branch lifecycle ownership rule in `CLAUDE.md`: merge the
feature branch into `main`, then delete it.
