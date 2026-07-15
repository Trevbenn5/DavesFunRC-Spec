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

## Change rules

**Any change to existing functionality, or adding new functionality MUST to go through the `create-change-spec` Skill first.  Do not implement any code changes until requested to do so by the user**

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

A full change specification is required when a request:

- Changes user-visible behaviour
- Changes validation or business rules
- Changes data structures
- Affects more than one component
- Affects a shared component
- Introduces a new dependency
- Changes the design system
- Creates meaningful regression risk

A lightweight change note is sufficient for:

- Correcting text
- Replacing an image
- Updating contact details
- Fixing a clear typo
- Changing metadata with no behavioural impact

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
