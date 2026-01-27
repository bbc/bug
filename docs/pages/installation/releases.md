---
title: Releases
parent: Installation
nav_order: 6
layout: page
---

# Releases

BUG uses a continuous release model: new versions are built and published automatically whenever commits are merged into the `main` branch. Development work happens in feature branches before merging.

Versioning follows the semantic format `vMAJOR.minor.patch`:

- `MAJOR` indicates a major version change. These include breaking changes or significant architectural updates. Currently, BUG is in its third major version. Commits that trigger a major release should use the prefix `Major:` in the commit message.
- `minor` indicates a minor release. These include new features or changes that may introduce deprecation but are generally backward compatible. Commits that trigger a minor release should use the prefix `Minor:` in the commit message.
- `patch` indicates a patch release. These include bug fixes, small improvements, or non-breaking changes. Commits without `Major:` or `Minor:` prefixes will trigger a patch release.

This system allows users to track updates and manage upgrades according to the level of change introduced.
