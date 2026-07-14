# Spec-Driven Website

A template for building a website through **incremental, specification-driven
development** with [Claude Code](https://claude.com/claude-code), deployed to
GitHub Pages.

Instead of prompting an agent to freely edit code, every feature and change
first becomes a written specification. Claude Code implements against that
spec, keeps the specs in sync with the implementation, and never regenerates
or replaces the application scaffold once it exists.

## How it works

1. **Scaffold once.** The application shell, layout, navigation, design
   system and shared components are created a single time and then treated
   as a persistent asset. Nothing should recreate or reinitialise them.
2. **Specify before you build.** New features and changes are written up as
   markdown specifications under `_specs/` before any code is touched.
3. **Implement against the spec.** Claude Code reads the relevant spec, the
   architecture and design-system docs, and the existing code, then makes the
   smallest change that satisfies the spec.
4. **Keep specs authoritative.** After implementation, the spec is updated to
   reflect current behaviour, and index files are kept up to date.

All of this behaviour is defined in [.claude/CLAUDE.md](.claude/CLAUDE.md)
and enforced by the Skills below — read that file for the full rules
(when a full spec vs. a lightweight change note is required, what counts as
an architectural change, definition of done, etc).

## Repository structure

```
.
├── .claude/
│   ├── CLAUDE.md              # Project instructions Claude Code always follows
│   └── skills/                # Skills that drive the spec-driven workflow
├── .github/workflows/
│   └── deploy-pages.yml       # CI: lint, typecheck, test, build, deploy to gh-pages
└── _specs/
    ├── product.md             # What the site is and who it's for
    ├── architecture.md        # Framework, structure and technical constraints
    ├── design-system.md       # Design tokens, components and UI conventions
    ├── static-assets/         # Source images/files referenced by specs
    ├── decisions/             # Accepted architectural decisions
    ├── features/<slug>/       # One folder per feature: spec.md, plan.md
    ├── changes/                # CHG-<n>-<slug>.md change specifications
    ├── feature-index.md       # Registry of all features and their status
    ├── change-index.md        # Registry of all changes and their status
    └── scaffold-status.md     # Created once scaffolding is complete
```

Files marked above (`feature-index.md`, `change-index.md`,
`scaffold-status.md`, `decisions/*`, feature/change folders) are created as
you use the workflow — a brand-new checkout only has `product.md`,
`architecture.md` and `design-system.md`.

## Getting started

1. **Fill in the specs.** Before scaffolding, write `_specs/product.md`,
   `_specs/architecture.md` and `_specs/design-system.md` for your project —
   these are the sources of truth every Skill reads first.
2. **Scaffold the site.** Run the scaffold Skill once to establish the
   application foundation:
   ```
   /create-scaffold
   ```
3. **Specify a feature.** Turn a feature idea into a spec on its own branch:
   ```
   /create-feature-spec [feature name or description]
   ```
4. **Implement the feature.** Build it against the approved spec:
   ```
   /implement-feature <feature-slug>
   ```
5. **Specify and implement changes** to existing behaviour the same way:
   ```
   /create-change-spec [requested update]
   /implement-change CHG-<n>-<slug>.md
   ```
6. **Deploy:**
   ```
   /deploy
   ```

## Skills reference

| Skill | Purpose |
| --- | --- |
| [`create-scaffold`](.claude/skills/create-scaffold/SKILL.md) | Creates the initial application foundation (framework, layout, nav, design tokens, shared components, testing). Run once; refuses to run again if a scaffold already exists. |
| [`create-feature-spec`](.claude/skills/create-feature-spec/SKILL.md) | Turns a feature idea into a spec file under `_specs/features/<slug>/spec.md` on a new `features/<slug>` branch. Writes the spec only — does not implement. |
| [`implement-feature`](.claude/skills/implement-feature/SKILL.md) | Implements an approved feature spec: creates a `plan.md`, makes the smallest coherent change, runs tests/lint/typecheck/build, updates `feature-index.md`, and commits to the feature branch. |
| [`create-change-spec`](.claude/skills/create-change-spec/SKILL.md) | Captures a requested modification to the existing site as a full change spec (`_specs/changes/CHG-<n>-<slug>.md`) or a lightweight change note, depending on scope. Writes the spec only. |
| [`implement-change`](.claude/skills/implement-change/SKILL.md) | Implements an approved change spec against the existing site, assesses impact on shared components and other features first, and updates the relevant specs and indexes afterward. |
| [`deploy`](.claude/skills/deploy/SKILL.md) | Merges the current feature branch into `main`, deletes the feature branch, builds for production, and pushes — GitHub Actions ([deploy-pages.yml](.github/workflows/deploy-pages.yml)) then lints, type-checks, tests, builds and deploys to GitHub Pages. |

## CI/CD

[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
runs on every push and PR to `main`: install → lint → typecheck → test →
build. On pushes to `main` it also uploads the `dist/` output and deploys it
to GitHub Pages.

## Key rules to keep in mind

- Never recreate, replace or reinitialise the scaffold once it exists.
- Reuse existing layouts, components, utilities and services rather than
  duplicating them.
- Change only the files a feature or change actually requires.
- If a request seems to need an architectural change, the relevant Skill
  will stop and record the decision instead of implementing it — it's
  applied only after you explicitly accept it.
- A feature or change isn't "done" until its acceptance criteria pass, tests
  pass, nothing has regressed, and `_specs/feature-index.md` (and
  `_specs/change-index.md`, where relevant) is updated.

See [.claude/CLAUDE.md](.claude/CLAUDE.md) for the complete set of project
instructions.
