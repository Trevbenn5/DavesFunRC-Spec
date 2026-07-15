---
name: create-change-spec
description: Create a specification for a requested change to the existing site
without implementing it or recreating the application scaffold. Use if work type Category="Change".
argument-hint: "[requested update]"
disable-model-invocation: true
------------------------------

# Create change specification

Create a change specification for:

$ARGUMENTS

## Purpose

Capture a requested modification to the existing site as a bounded,
testable change.

This Skill creates or updates specification files only.

Do not implement the change.

## Discovery

Before writing the change specification:

1. Commit any uncommitted changes.
2. All changes are made on the `main` branch, so ensure you are on the `main` branch.
3. Read `CLAUDE.md`.
4. Read `_specs/architecture.md`.
5. Read `_specs/design-system.md`.
6. Read `_specs/feature-index.md`.
7. Inspect the current implementation.
8. Identify the feature, shared component or architectural area affected.
9. Read the relevant existing feature specification.
10. Search existing change specifications for overlap.

## Classify the change

Classify the request as one of:

* Content
* Design
* Existing-feature enhancement
* Defect
* Configuration
* Dependency
* Architecture

## Branching strategy

Before making any content;

- Stay on the main branch for content changes to text, images, or other static assets that do not justify the overhead of a new branch.

- For larger or complex changes,  switch to a new Git branch using the `branch_name` derived from the `$ARGUMENTS`. If the branch name is already taken, then append a version number to it: e.g. `changes/card-component-01`

## Output

Create:

`_specs/changes/CHG-<next-number>-<change-slug>.md`

## Required structure

The full change specification for large and complex changes must contain:

* Change ID
* Status
* Requested change
* Reason
* Current behaviour
* Desired behaviour
* Change classification
* Affected specification
* Affected implementation areas
* Requirements
* Acceptance criteria
* Regression risks
* Out of scope
* Documentation updates

The lightweight change note for minor text, image or static asset changes must contain:
* Change ID
* Status
* Requested change
* Affected files

## Boundaries

The specification must describe the smallest coherent change.

Do not:

* Redesign unrelated areas
* Recreate the project
* Replace the application scaffold
* Add unrelated requirements
* Assume missing business rules
* Convert a small change into a broad refactor

## Architectural changes

If the request requires an architectural change:

1. Record that an architectural decision is required.
2. Identify the affected constraints.
3. Do not produce an implementation-ready change specification until the
   architectural decision has been accepted.

## Completion

Update `_specs/change-index.md` with:

* Change ID
* Change title
* Classification
* Affected feature
* Status: Proposed
