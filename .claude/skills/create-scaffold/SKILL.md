---
name: create-scaffold
description: Create the initial website foundation for a new project. Use only
  when the project has not already been scaffolded.
---

# Create website scaffold

Create the initial application foundation.

## Preconditions

Before making changes:

1. Check whether `_specs/scaffold-status.md` exists.
2. Inspect `package.json`, `src/`, application routes and shared components.
3. If a working scaffold already exists, do not recreate it.
4. Report that the scaffold is already present and stop.

## Required inputs

Read:

- `_specs/product.md`
- `_specs/architecture.md`
- `_specs/design-system.md`

Do not begin until these documents provide enough information to establish
the basic application structure.

## Create

Establish only the reusable application foundation:

- Framework and build configuration
- Application shell
- Global layout
- Navigation
- Design tokens
- Base typography and styling
- Shared UI components
- Routing conventions
- Error handling conventions
- Testing infrastructure
- Placeholder landing page
- Development scripts

Do not implement detailed business features during scaffolding.

## Completion record

Create `_specs/scaffold-status.md` containing:

- Scaffold completion date
- Framework and major dependencies
- Application entry points
- Shared layout locations
- Design system locations
- Test commands
- Build commands
- Architectural constraints

Update `_specs/architecture.md` if implementation decisions differ from the
original proposal.

Run the build, tests, linting and type checking.
