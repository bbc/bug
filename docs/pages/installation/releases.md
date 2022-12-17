---
layout: page
title: Releases
parent: Installation
nav_order: 6
---

# Releases

BUG is released continuously whenever commits are made to the `main` branch. Development takes place in other branches before being merged into the `main` branch.

Versioning follows the predefined formats `vMAJOR.minor.patch` where:

-   `MAJOR` is a major version change. BUG is currently on its third incarnation. Any change to this version number is invoked with a `main` branch push using `Major:` as the commit tagline. Expect lots of breaking changes.
-   `minor` is a major version change - a change that adds significant new features or deprecation which as a result creates a breaking change. Pushes to the `main` branch with statement `Minor:` preceding them will trigger a minor release.
-   `patch` is a patch change - a change that correct bugs in bug or makes small modifications and additions; it should not result in a breaking change. Pushes to the `main` branch with none of the above release statements will trigger a patch release.
