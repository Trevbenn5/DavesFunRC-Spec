---
name: implement-change
description: Implement one approved change specification against the existing site while preserving the scaffold and unrelated behaviour.  Use if work type Category="Change".
argument-hint: "[CHG-### or path to change specification]"
disable-model-invocation: true
------------------------------

# Implement approved change

Implement the change described by:

$ARGUMENTS

If the argument is a change ID (e.g. `CHG-009`) rather than a file path,
resolve it to its specification file by matching that ID against the
filenames in `_specs/changes/` (there should be exactly one match). If none
or more than one file matches, stop and ask the user to disambiguate.

## Preconditions

Before changing code:

1. Check git status; if the working tree is dirty, stop and tell the user
   to commit or stash first (per CLAUDE.md's Dirty working tree rule).
   Then create the change branch (`changes/<slug>`, per CLAUDE.md's
   Branching strategy) from up-to-date `main` — the spec was committed to
   `main` by `create-change-spec`, not to a branch, so this Skill is the
   one that creates it.
2. Read `CLAUDE.md`.
3. Read the change specification.
4. Confirm the change status permits implementation.
5. Read the affected feature specification.
6. Read `_specs/architecture.md`.
7. Read `_specs/design-system.md`.
8. Inspect the current implementation and tests.
9. Identify the smallest set of files that needs to change.

Do not recreate the application scaffold.

## Impact assessment

Before implementation, record:

* Existing behaviour affected
* Shared components affected
* Features potentially affected
* Tests that protect current behaviour
* Documentation that must be updated
* Whether the change conflicts with architecture or design-system rules

If the change requires an unapproved architectural decision, stop before
implementation.

## Implementation rules

* Implement only requirements in the approved change specification.
* Preserve unrelated behaviour.
* Reuse existing components and services.
* Avoid unrelated refactoring.
* Avoid changing public interfaces unnecessarily.
* Add regression tests for changed behaviour.
* Update existing tests where the intended behaviour has changed.
* Do not weaken tests merely to make them pass.

## Verification

Verify:

* Every change acceptance criterion
* Existing feature acceptance criteria
* Relevant regression tests
* Accessibility
* Responsive behaviour
* GitHub Pages base-path behaviour
* Production build

Run:

* `npm run lint`
* `npm run typecheck`
* `npm run test`
* `npm run build`

Run end-to-end tests where the affected feature has a critical user journey.

## Specification updates

After successful implementation:

1. Update the affected feature specification so it reflects the new current
   behaviour.
2. Update design-system documentation if an approved reusable design rule changed.
3. Update architecture documentation only when an approved architectural
   decision changed it.
4. Update `_specs/feature-index.md` where relevant.
5. Set the change status to `Implemented`.
6. Update `_specs/change-index.md`.

The completed feature specification must remain the authoritative statement of current behaviour.

## Commit and close out the branch

Commit the changed files to the relevant branch (change or `main`) with a
commit message that includes the change specification path.

If the change was made on a change branch, follow the Branch lifecycle ownership rule in `CLAUDE.md`: merge the branch into `main`, then delete it.