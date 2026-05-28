---
title: Documentation Workflow
parent: Development
nav_order: 2
layout: page
---

# Documentation Workflow

This page explains how BUG documentation is built and published, with a focus on how module docs are derived from module files and GitHub Actions.

---

## Sources of Truth

For each module in `src/modules/<module-name>`, documentation is assembled from three files:

- `README.md`: main documentation body for the module page.
- `CHANGELOG.md`: version history appended to the module page.
- `module.json`: metadata used in the generated modules index (name, description, version, status).

The docs generator reads these files and creates static pages in `docs/pages/modules`.

---

## Module Docs Generation

The generator script is `docs/scripts/generateModules.js`.

It performs the following steps:

1. Enumerates all folders in `src/modules`.
1. Reads each module's `module.json` for title, description, version, and status.
1. If `README.md` exists:
    - Creates `docs/pages/modules/<module>/index.md`.
    - Prepends Jekyll front matter.
    - Injects the README body.
    - Appends `CHANGELOG.md` content (if present).
1. Copies `src/modules/<module>/assets` to `docs/pages/modules/<module>/assets`.
1. Rebuilds `docs/pages/modules/index.md` as a generated modules table.
1. Rewrites `docs/_data/sidebar.yml` for the docs navigation structure.

Important behavior details:

- README placeholders of `{DOCS_BASEURL}` are replaced during generation.
- Modules without `README.md` still appear in the modules table, but without a link.
- `docs/pages/modules/index.md` is generated output and should not be treated as hand-authored content.

---

## GitHub Actions Involved

### Documentation and Site Publishing

Workflow file: `.github/workflows/documentation.yml`

Trigger:

- Push to `main` for docs, storybook, core client component/story paths, and `src/modules/**/*.md`.

Jobs:

1. `codespell`: checks spelling in `docs`.
1. `storybook`: builds Storybook from `src/client` and uploads it as an artifact.
1. `pages`:
    - downloads the Storybook artifact,
    - copies it to `docs/storybook`,
    - runs `node docs/scripts/generateModules.js`,
    - builds the Jekyll site,
    - uploads the Pages artifact.
1. `deploy`: deploys the Pages artifact to GitHub Pages.

This means module docs are regenerated at publish time, not manually curated in `docs/pages/modules`.

### Version and Changelog Automation

Workflow file: `.github/workflows/versioning.yml`

Trigger:

- Push to `main` for `src/server/**`, `src/client/**`, and `src/modules/**`.

Scripts:

- `.github/scripts/updateModules.js`
- `.github/scripts/updateApp.js`

`updateModules.js` behavior:

- Scans commits per module path.
- Accepts module commits in the format:

```
[module-name] message
```

- Deduplicates by changelog description.
- Bumps patch version in `src/modules/<module>/module.json`.
- Prepends a new section in `src/modules/<module>/CHANGELOG.md` with commit links.

`updateApp.js` behavior (non-module/app-wide):

- Accepts commit messages in this format:

```
[app] message
[app][breaking] message
```

- Updates root `CHANGELOG.md`.
- Bumps root and client package versions (`package.json` and `src/client/package.json`).
- Creates and pushes a git tag for the new app version.

---

## Practical Flow for Module Authors

When documenting or changing a module, the typical flow is:

1. Update `src/modules/<module>/README.md` and module assets.
1. Commit module code/docs changes with module-prefixed commit messages, e.g. `[bmd-videohub] improve lock status docs`.
1. Merge to `main`.
1. Versioning workflow updates `module.json` and `CHANGELOG.md`.
1. Documentation workflow regenerates module pages and deploys GitHub Pages.

For local verification before pushing:

```bash
npm ci
node docs/scripts/generateModules.js
```

Then inspect `docs/pages/modules/index.md` and generated module pages.

---

## Maintenance Notes

- Treat module `README.md` as the primary authored documentation.
- Keep module commit messages consistent with `[module-name] ...` so changelog/version automation works.
- Avoid hand-editing generated module output unless debugging the generator itself.
