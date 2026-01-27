---
title: Git
parent: Development
nav_order: 2
layout: page
---

# Git

## Best Practices

To keep our codebase clean, maintainable, and easy to collaborate on, we recommend the following Git and GitHub practices:

### Branching

- **Use feature branches**: Create a new branch for each new feature, bugfix, or improvement. Example:

    ```
    git checkout -b feature/add-login
    ```

- **Keep `main` stable**: Only merge thoroughly tested and reviewed changes into the main branch.
- **Use descriptive branch names**: Make it clear what the branch is for (e.g., `bugfix/mg4-ui-glitch`).

### Commits

- **Write meaningful commit messages**: Each commit should clearly explain what was changed and why.

    ```
    [module-name] fixed crash when updating settings
    ```

- **Small, focused commits**: Commit often, but keep each commit focused on a single change or fix.
- **Avoid committing generated files**: Don’t commit compiled binaries, node_modules, or other build artifacts unless required.

### Pull Requests (PRs)

- **Create a PR for every merge into main**: This allows code review and automated CI checks.
- **Link PRs to issues**: If you are fixing a bug or implementing a feature, reference the GitHub issue in the PR description.
- **Request review**: Get at least one team member to review your changes before merging.

### Merging

- **Use merge or squash merges**: Decide whether to keep full commit history (`merge`) or condense commits into one (`squash`) before merging to main.
- **Resolve conflicts carefully**: Always pull the latest main branch before merging to minimize conflicts.

### General Tips

- **Pull regularly**: Keep your local repository in sync with the remote to avoid surprises.

    ```
    git pull origin main
    ```

- **Review history**: Use `git log` or GUI tools to understand changes before merging.
- **Keep it clean**: Periodically delete merged branches to reduce clutter on GitHub.

## Module versioning

When you commit changes to a module to GitHub you can use commit message to automatically increase the build number and update the changelog.

If you format it like this:

```
[yourmodulename] fixed various bugs
```

... a github action workflow will:

- parse your commit message
- increase the build number (for example from 1.0.1 to 1.0.2) in the modules config file (module.json)
- update the CHANGELOG.md file in the module folder (using this new version)

When a user updates their BUG instance they'll now be prompted to upgrade their module.

> NOTE: If you don't want to trigger this process, just use a simple commit message
