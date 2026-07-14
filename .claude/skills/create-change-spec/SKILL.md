---
name: create-change-spec
description: Create a specification for a requested change to the existing site
without implementing it or recreating the application scaffold.
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

1. Read `CLAUDE.md`.
2. Read `_specs/architecture.md`.
3. Read `_specs/design-system.md`.
4. Read `_specs/feature-index.md`.
5. Inspect the current implementation.
6. Identify the feature, shared component or architectural area affected.
7. Read the relevant existing feature specification.
8. Search existing change specifications for overlap.

## Classify the change

Classify the request as one of:

* Content
* Design
* Existing-feature enhancement
* Defect
* Configuration
* Dependency
* Architecture

## Output

Create:

`_specs/changes/CHG-<next-number>-<change-slug>.md`

## Required structure

The full change specification must contain:

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

The lightwekight change note must contain:
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
