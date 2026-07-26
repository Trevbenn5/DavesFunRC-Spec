# CHG-009 — Forward GA measurement ID to the deploy workflow

## Status

Implemented (2026-07-26)

## Requested change

Forward the existing `VITE_GA_MEASUREMENT_ID` GitHub Actions secret into
the `Build` step of `.github/workflows/deploy-pages.yml`, the same way
`VITE_YOUTUBE_API_KEY` and `VITE_YOUTUBE_UPLOADS_PLAYLIST_ID` are already
forwarded.

## Reason

The Google Analytics Tracking feature
(`_specs/features/google-analytics-tracking/spec.md`) was implemented and
merged to `main`, and a `VITE_GA_MEASUREMENT_ID` repo secret already
exists. But after deploying, the site owner checked Google Analytics and
saw no data despite visiting the live site.

Investigated by fetching the deployed bundle directly
(`https://davesfunrc.com/assets/index-*.js`): it contains zero references
to `googletagmanager`. `src/services/analytics.service.ts` reads
`import.meta.env.VITE_GA_MEASUREMENT_ID`, which Vite inlines as a literal
at build time. Because the CI build never had that variable set, it was
inlined as `undefined`, and the minifier dead-code-eliminated the entire
`if (!measurementId) return;` branch — along with the script-injection
logic it guards — since the condition was statically always true. The
production bundle isn't failing silently; the analytics code simply isn't
present in it.

## Current behaviour

`deploy-pages.yml`'s `Build` step only sets:

```yaml
env:
  VITE_YOUTUBE_API_KEY: ${{ secrets.VITE_YOUTUBE_API_KEY }}
  VITE_YOUTUBE_UPLOADS_PLAYLIST_ID: ${{ secrets.VITE_YOUTUBE_UPLOADS_PLAYLIST_ID }}
```

`VITE_GA_MEASUREMENT_ID` is not listed, so `npm run build` in CI always
runs with it unset, regardless of the secret's existence in repo
settings.

## Desired behaviour

The `Build` step's `env` block also forwards
`VITE_GA_MEASUREMENT_ID: ${{ secrets.VITE_GA_MEASUREMENT_ID }}`, so the
production build inlines the real measurement ID and the analytics
script-loading code survives minification. After the next deploy, page
views on davesfunrc.com should start appearing in Google Analytics
(subject to GA's own reporting delay).

## Change classification

Configuration

## Affected specification

`_specs/features/google-analytics-tracking/spec.md` (Open questions
already flagged "where the production env var is set" as unresolved —
this change resolves it) and `_specs/architecture.md` §27 (GitHub Pages
Deployment workflow steps).

## Affected files

- `.github/workflows/deploy-pages.yml` — add one line to the `Build`
  step's existing `env` block:
  ```yaml
  VITE_GA_MEASUREMENT_ID: ${{ secrets.VITE_GA_MEASUREMENT_ID }}
  ```
- No application source files change. No new secret needs to be created
  — `VITE_GA_MEASUREMENT_ID` already exists in repo secrets (confirmed
  via `gh secret list`).

## Acceptance criteria

- Given the `Build` step's `env` block includes
  `VITE_GA_MEASUREMENT_ID`, when the workflow runs on a push to `main`,
  then `npm run build` executes with that variable set from the repo
  secret.
- Given the site is redeployed with this change, when the built bundle
  is inspected, then it contains a `googletagmanager` script reference
  (i.e., the analytics code was not dead-code-eliminated).
- `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run
  build` (as already run by the workflow itself) continue to pass
  unchanged — this change touches no application source.

## Regression risks

Minimal. This only adds one env var to an existing, working step; it
does not change what the `YouTube` variables do, does not change build
commands, and does not touch the `deploy` job. Worst case if the secret
were ever removed from repo settings: identical to today's behaviour
(analytics code compiled out, site otherwise unaffected) — same
graceful-degradation guarantee the feature spec already requires.

## Out of scope

- Adding a cookie-consent mechanism (already flagged as a separate open
  question in the feature spec, not part of this fix).
- Any other workflow changes.

## Documentation updates

None beyond this spec and `_specs/change-index.md`. The feature spec's
"Where the production env var is set" open question is resolved by this
change and doesn't need a separate edit — it was already phrased as
"whoever runs `implement-feature`/a follow-up change will need to
confirm," which this change is that follow-up.
