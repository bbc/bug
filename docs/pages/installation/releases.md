---
layout: page
title: Releases
parent: Installation
nav_order: 5
---

# Releases

BUG is released continously whenver commits are made to the `main` branch. Development takes place in other branches before being merged into the `main` brnach.

Versioning follows the following predefined formate `X.y.z-string` where;
i

-   `X` is a major version change, BUG is currently on it's 3rd incarnation, any change to this version number is invoked with a `main` branch push using the `[Release: Major]` as the description. Expect lots of breaking changes.
-   `y` is a major version change - a change that adds signification new features or depraction which as a result creates a breaking change. Pushes to the `main` branch with statement `[Release: Minor]` preceding them will trigger a major release.
-   `z` is a patchchange - a change that correct bugs in bug or makes small modifications and editions, it should not results in a breaking change. Pushes to the `main` branch with none of the above release statements will trigger a patch release.
-   `string` denotes which branch the build is related to the `main` branch will have main following it here, the development branch `development` and so on.
