---
name: deploy
description: Deploy the application to the production environment on GitHub pages
argument-hint: "[deployment target]"
disable-model-invocation: true
------------------------------

The application is deployed to GitHub pages via the `deploy-pages.yml` workflow in `.github/workflows/`. The workflow is triggered by a push to the `main` branch.

# Deploy application

## Preconditions

1. Confirm you are on `main`.
2. Confirm the working tree is clean (no uncommitted, unstaged, or untracked changes).
3. Confirm `main` is up to date with `origin/main`.

Branch merging is not deploy's responsibility — see Branching strategy in
`CLAUDE.md`. If you're not on a clean, up-to-date `main`, stop and tell the
user rather than merging or committing on their behalf.

## Deploy
1. Build the application for production.
2. Push the built application to the remote repository