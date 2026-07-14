---
name: implement-feature
description: Implement one approved feature specification incrementally within
  the existing website without recreating the scaffold.
argument-hint: "[path to feature specification]"
disable-model-invocation: true
---

# Implement a specified feature

Implement the feature described by:

$ARGUMENTS

## Preconditions

Before changing code:

1. Confirm you're on the feature branch and have pulled the latest changes.
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

## Commit to the feature branch

Commit any new or updated files with a message like:
```
Add feature specification for <feature_title>
```

## merge the feature branch to the main branch

Once the feature is complete and all tests pass, merge the feature branch to the main branch.

## Delete the feature branch

Once the feature is complete and merged, delete the feature branch to keep the repository clean.
