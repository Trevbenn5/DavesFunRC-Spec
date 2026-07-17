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
   markdown specifications under `_specs/`, committed straight to `main` —
   no branch exists yet at this point. Pure content edits (a typo, a text
   correction, an image swap) skip spec-writing entirely via the
   [Content fast path](#content-fast-path).
3. **Branch, then implement.** Only when implementation starts does a
   short-lived `features/<slug>` or `changes/<slug>` branch get created, from
   `main`. Claude Code reads the relevant spec, the architecture and
   design-system docs, and the existing code, then makes the smallest change
   that satisfies the spec, before merging back into `main` and deleting the
   branch.
4. **Keep specs authoritative.** After implementation, the spec is updated to
   reflect current behaviour, and index files (or `content-log.md`, for
   fast-path edits) are kept up to date.

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
    ├── content-log.md         # Dated log of Content fast-path edits
    └── scaffold-status.md     # Created once scaffolding is complete
```

Files marked above (`feature-index.md`, `change-index.md`,
`content-log.md`, `scaffold-status.md`, `decisions/*`, feature/change
folders) are created as you use the workflow — a brand-new checkout only has
`product.md`, `architecture.md` and `design-system.md`.

## Getting started

1. **Fill in the specs.** Before scaffolding, write `_specs/product.md`,
   `_specs/architecture.md` and `_specs/design-system.md` for your project —
   these are the sources of truth every Skill reads first.
2. **Scaffold the site.** Run the scaffold Skill once to establish the
   application foundation:
   ```
   /create-scaffold
   ```
3. **Specify a feature.** Turn a feature idea into a spec, committed
   straight to `main` (no branch yet):
   ```
   /create-feature-spec [feature name or description]
   ```
4. **Implement the feature.** Creates a `features/<slug>` branch from
   `main`, builds against the approved spec, then merges back into `main`
   and deletes the branch:
   ```
   /implement-feature <feature-slug>
   ```
5. **Specify and implement changes** to existing behaviour the same way:
   ```
   /create-change-spec [requested update]
   /implement-change CHG-<n>-<slug>.md
   ```
6. **Content-only edit?** Skip step 5's Skills — see the
   [Content fast path](#content-fast-path) instead.
7. **Deploy:**
   ```
   /deploy
   ```

## Skills reference

| Skill | Purpose |
| --- | --- |
| [`create-scaffold`](.claude/skills/create-scaffold/SKILL.md) | Creates the initial application foundation (framework, layout, nav, design tokens, shared components, testing). Run once; refuses to run again if a scaffold already exists. |
| [`create-feature-spec`](.claude/skills/create-feature-spec/SKILL.md) | Turns a feature idea into a spec file under `_specs/features/<slug>/spec.md`, committed straight to `main` (`Status: Specified` in `feature-index.md`). Writes the spec only — no branch is created and nothing is implemented; that's `implement-feature`'s job. |
| [`implement-feature`](.claude/skills/implement-feature/SKILL.md) | Implements an approved feature spec: creates the `features/<slug>` branch from `main`, writes a `plan.md`, makes the smallest coherent change, runs tests/lint/typecheck/build, updates `feature-index.md`, then commits, merges into `main` and deletes the branch. |
| [`create-change-spec`](.claude/skills/create-change-spec/SKILL.md) | Mandatory for every Change request except [Content fast path](#content-fast-path) edits. Captures a requested modification as a full change spec or a lightweight change note (`_specs/changes/CHG-<n>-<slug>.md`, with wireframes/mockups for visual changes), committed straight to `main` (`Status: Proposed` in `change-index.md`). Writes the spec only. |
| [`implement-change`](.claude/skills/implement-change/SKILL.md) | Implements an approved change spec: creates the `changes/<slug>` branch from `main`, assesses impact on shared components and other features, implements, then commits, merges into `main` and deletes the branch. |
| [`deploy`](.claude/skills/deploy/SKILL.md) | Confirms `main` is clean and up to date with `origin`, then pushes. Does not merge or delete branches — that's owned by `implement-feature`/`implement-change`. GitHub Actions ([deploy-pages.yml](.github/workflows/deploy-pages.yml)) then lints, type-checks, tests, builds and deploys to GitHub Pages. |

## Content fast path

Pure content edits — correcting text, replacing an image, updating contact
details, fixing a typo, or a metadata change with no behavioural impact —
skip `create-change-spec` and `implement-change` entirely: make the edit
directly, run the relevant checks for the touched area, record it as a
dated bullet in `_specs/content-log.md`, and commit straight to `main` (no
branch). Anything that also touches behaviour, structure, or a shared
component — even alongside a content change — goes through
`create-change-spec` instead. See `CLAUDE.md`'s Content fast path section
for the full rules.

## CI/CD

[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
runs on every push to `main` (or via manual dispatch): install → lint →
typecheck → test → build → upload the `dist/` output → deploy to GitHub
Pages.

## Key rules to keep in mind

- Never recreate, replace or reinitialise the scaffold once it exists.
- Reuse existing layouts, components, utilities and services rather than
  duplicating them.
- Change only the files a feature or change actually requires.
- Spec-writing and implementation happen on different sides of a branch:
  `create-feature-spec`/`create-change-spec` commit their spec straight to
  `main`; only `implement-feature`/`implement-change` create, merge and
  delete a branch.
- If a request seems to need an architectural change, the relevant Skill
  will stop and record the decision instead of implementing it — it's
  applied only after you explicitly accept it.
- A feature or change isn't "done" until its acceptance criteria pass, tests
  pass, nothing has regressed, and `_specs/feature-index.md` (and
  `_specs/change-index.md`, where relevant) is updated.

See [.claude/CLAUDE.md](.claude/CLAUDE.md) for the complete set of project
instructions.
