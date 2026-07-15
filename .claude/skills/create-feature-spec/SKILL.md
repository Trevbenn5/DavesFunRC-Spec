---
name: create-feature-spec
description: Create or refine a specification for one website feature without
  implementing it or changing the existing application scaffold.  Use if work type Category="Feature".
argument-hint: "[feature name or description]"
disable-model-invocation: true
---

# Create a feature specification

Create a specification for one feature:

$ARGUMENTS

## High level behavior

Your job will be to turn the user input above into:

- A human friendly feature title in kebab-case (e.g. new-contact-form)
- A safe git branch name not already taken (e.g. features/new-contact-form)
- A detailed markdown spec file under the `_specs/` directory in the new branch

## Boundaries

This Skill creates specification files only.

Do not:

- Implement the feature
- Regenerate the website
- Reinitialise the framework
- Replace the application shell
- Modify shared components
- Install dependencies
- Change project configuration

## Discovery

Before writing the specification:

1. Read `CLAUDE.md`.
2. Read `specs/product.md`.
3. Read `specs/architecture.md`.
4. Read `specs/design-system.md`.
5. Inspect relevant existing routes, components, services and tests.
6. Search existing feature specifications for overlap.

Use the current application as the implementation baseline.

## Follow step 1 to step 5

### Step 1. Check the current branch

Check the current Git branch, and abort this entire process if there are any uncommitted, unstaged, or untracked files in the working directory. Tell the user to commit or stash changes before proceeding, and DO NOT GO ANY FURTHER.

### Step 2. Parse the arguments

From `$ARGUMENTS`, extract:

- `feature_title` - A short, human readable title in Title Case. Example: "Card Component for Dashboard Stats".
- `feature_slug` and `branch_name` — derive per the naming convention in CLAUDE.md's Branching strategy (`features/<slug>`).

If you cannot infer a sensible `feature_title` and `feature_slug`, ask the user to clarify instead of guessing.

### Step 3. Switch to a new Git branch

Before making any content, switch to a new Git branch using the `branch_name` derived from the `$ARGUMENTS`. If the branch name is already taken, then append a version number to it: e.g. `features/new-contact-form-01`

### Step 4. Draft the spec content

Create:

`_specs/features/<feature-slug>/spec.md`

Create the directory if it does not exist.

### Step 5. Final output to the user

After the file is saved, respond to the user with a short summary in this exact format:

Branch: <branch_name>
Spec file: _specs/features/<feature_slug>/spec.md
Title: <feature_title>

Do not repeat the full spec in the chat output unless the user explicitly asks to see it. The main goal is to save the spec file and report where it lives and what branch name to use.

## Specification structure

The specification must contain:

# Feature: [name]

## Purpose

Explain the user or business outcome.

## Scope

Describe what is included.

## Out of scope

Describe what is explicitly excluded.

## User stories

List the relevant user stories.

## User experience

Describe the expected interaction and relevant application states.

## Functional requirements

Use numbered requirements:

- FR-001
- FR-002

## Non-functional requirements

Include applicable accessibility, security, performance, privacy and
supportability requirements.

## Data requirements

Describe entities, fields, validation and persistence requirements.

## Interfaces

Describe required pages, components, APIs and integrations.

## Existing components to reuse

Identify existing layouts, components, services, utilities and patterns that
should be reused.

## Expected changes

Identify likely files or application areas affected. Do not prescribe a
complete implementation unless technically necessary.

## Constraints

Record relevant architectural and technical boundaries.

## Edge cases

Describe errors, empty states, permissions and unusual inputs.

## Acceptance criteria

Write testable Given/When/Then acceptance criteria.

## Open questions

Record unresolved decisions. Do not invent missing business rules.

## Tests

Write the types of tests that should be added or updated, and any relevant test data.

## Completion

Update `specs/feature-index.md` with:

- Feature name
- Specification path
- Status: Specified
- Dependencies