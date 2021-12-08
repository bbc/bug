---
layout: default
---

BUG makes a few underlying assumptions built into its architecture that will guide you in developing modules for it. A module's backend exists within its own docker container. The frontend is loaded by BUG core

# Overview

-   [Overview ](/pages/architecture/overview.html)

*   Mobile first
*   It's not mission critical
*   80% of the functionality of any device.
*   Keep it simple
*   Keep it self-contained
*   One module per function
*   Connect modules (videohub) but don't depend
*   Consider performance
*   Consider load on device
*   Consider connections to device

## Module Memory is Volatile

Anything created in a module's container during operation should not be viewed as persistent. While it is true that this data in fact persists for as long as the container does you should design modules in such a way that operation could continue without this data.

Leading on from this configuration that should persist is managed and stored by BUG core and passed to the container when it is created, started or changes are made to the config in BUG core.

Each module has access to a mongo database named as the panel ID that can be used as desired by the module developer. It functions in a similar way to a cache facilitating the sharing of data between workers.
