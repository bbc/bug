---
layout: page
title: Releases
parent: Installation
nav_order: 5
---

# Releases

BUG is released continously whenver commits are made to the `main` branch. Development takes place in other branches before being merged into the `main` brnach.

Versioning follows the following predefined formate `vMAJOR.minor.patch` where;

-   `MAJOR` is a major version change, BUG is currently on it's 3rd incarnation, any change to this version number is invoked with a `main` branch push using the `Major:` as the commit tagline. Expect lots of breaking changes.
-   `minor` is a major version change - a change that adds signification new features or depraction which as a result creates a breaking change. Pushes to the `main` branch with statement `Minor:` preceding them will trigger a major release.
-   `patch` is a patch change - a change that correct bugs in bug or makes small modifications and editions, it should not results in a breaking change. Pushes to the `main` branch with none of the above release statements will trigger a patch release.
