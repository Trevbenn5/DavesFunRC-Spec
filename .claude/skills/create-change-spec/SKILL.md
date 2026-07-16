---
name: create-change-spec
description: Create a specification for a requested change to the existing site
  without implementing it or recreating the application scaffold. Use if work type Category="Change".
argument-hint: "[requested update]"
disable-model-invocation: true
---

# Create change specification

Create a change specification for:

$ARGUMENTS

## Purpose

Capture a requested modification to the existing site as a bounded,
testable change.

This Skill creates or updates specification files only.

Do not implement the change.

## This Skill is mandatory, not conditional

Run this Skill for every Category='Change' request, with no exceptions,
including requests that look like a one-line text edit, image swap, or
typo fix.

The "lightweight change note" vs. "full change specification" distinction
in `CLAUDE.md`'s Change specification thresholds controls only how detailed
the output document is (see Required structure below). It does not mean the
change is exempt from this Skill, and it is not permission to edit source
files directly. Even a lightweight change gets a `_specs/changes/CHG-*.md`
file, created by this Skill, before any code changes — do not shortcut this
because the request seems small.

Do not edit application source files as part of this Skill or before it has
produced a spec file. Implementation happens only after the user reviews
the spec and explicitly asks for it, via `implement-change`.

## Discovery

Before writing the change specification:

1. Check git status, and abort this entire process if there are any
   uncommitted, unstaged, or untracked files in the working directory. Tell
   the user to commit or stash changes before proceeding, and DO NOT GO ANY
   FURTHER. (Per CLAUDE.md's Spec-creation commits, this Skill commits
   straight to `main`, so a dirty tree would bundle in unrelated work.)
2. Read `CLAUDE.md`.
3. Read `_specs/architecture.md`.
4. Read `_specs/design-system.md`.
5. Read `_specs/feature-index.md`.
6. Inspect the current implementation.
7. Identify the feature, shared component or architectural area affected.
8. Read the relevant existing feature specification.
9. Search existing change specifications for overlap.

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

This Skill never creates or switches branches. Per CLAUDE.md's Branching
strategy, it only writes the spec file and commits it straight to `main`;
`changes/<slug>` (per the naming convention in CLAUDE.md) is created later,
only by `implement-change`, and only when the change doesn't qualify for the
Content fast path.

## Output
Create:

`_specs/changes/CHG-<next-number>-<change-slug>.md`

Commit the new spec file and the `change-index.md` update (see Completion)
directly to `main` — no branch, per CLAUDE.md's Spec-creation commits. Do
not implement the change or create `changes/<slug>`; that happens later,
only when the user explicitly asks for `implement-change`.

## Required structure

The structure of the change specification depends on the complexity of the requested change. The Skill will determine whether a full change specification or a lightweight change note is appropriate.

The full change specification for large and complex changes must contain:

* Change ID
* Status
* Requested change
* Reason
* Current behaviour
* Desired behaviour
* wireframes/mockups using artifact-design skill (only if the change is visual)
* Change classification
* Affected specification
* Affected implementation areas
* Requirements
* Acceptance criteria
* Regression risks
* Out of scope
* Documentation updates

The lightweight change note for simple changes must contain:
* Change ID
* Status
* Requested change
* wireframes/mockups using artifact-design skill (only if the change is visual)
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

Commit this update together with the spec file (see Output) in a single
commit directly to `main`.
