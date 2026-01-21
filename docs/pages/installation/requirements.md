---
layout: page
title: Requirements
parent: Installation
nav_order: 7
---

# Requirements

This page outlines the recommended specifications for host hardware to run BUG efficiently.

---

## Disk Space

-   The BUG Docker image is approximately 300MB.
-   Allocate at least 2GB of free disk space for the core application.
-   Each additional panel may require roughly 200MB of storage.

---

## Memory

-   BUG itself requires at least 1GB of free RAM.
-   Each container typically consumes around 100MB of RAM.
-   Some modules have higher memory requirements. For example, the Cisco-SG module requires about 250MB. These requirements are defined in the module’s `module.json` under the optional `memory` field.
-   Additional memory usage comes from workers: each worker typically consumes ~10MB.

**Development Note:** If building a development version of BUG, you should have at least 4GB of RAM to allow `vite` to compile the frontend efficiently.

---

## CPU

There are no strict CPU requirements for running BUG, but here are some real-world examples from tested systems:

-   **Intel Core i3**  
    Can run Docker, MongoDB, and the BUG web app. Suitable for a few lightweight modules.

-   **Intel Core i5**  
    Can run Docker, MongoDB, and the BUG web app. Capable of handling several modules simultaneously.

-   **Intel Core i7**  
    Can run Docker, MongoDB, and the BUG web app. Supports a large number of containers; in some events, over 20 switch panels were managed concurrently.

### Architecture

-   BUG currently only supports x64 CPU architectures.
