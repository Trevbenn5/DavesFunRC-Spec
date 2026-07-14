---
name: deploy
description: Deploy the application to the production environment on GitHub pages
argument-hint: "[deployment target]"
disable-model-invocation: true
------------------------------

The application is deployed to GitHub pages via the `deploy-pages.yml` workflow in `.github/workflows/`. The workflow is triggered by a push to the `main` branch, and it builds the application and deploys it to the `gh-pages` branch.

# Deploy application
1. Commit all changes to the current feature branch.
2. Merge the feature branch into the main branch.
3. Delete the feature branch after merging.
4. Build the application for production.
5. Push the built application to the remote repository