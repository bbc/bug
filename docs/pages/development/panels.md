---
title: Panels
parent: Development
nav_order: 2
layout: page
---

# Panels

In BUG, each panel represents an instance of a module. Panels are run in their own Docker containers, which are built and managed using Dockerode, a Node.js library for interacting with the Docker API.

---

## Adding a Panel

When a new panel is added:

1. Build the module's container if it hasn't been built yet.
    - Each module type has a container folder used to generate the Docker image.
2. Create the container using Dockerode.
    - Container configuration includes environment variables, network settings, and volume mounts.
3. Start the container so it begins running the module's service.
4. Enable the panel through the enable/disable route.
    - This registers the panel with the UI and makes it available for users.

---

## Enabling a Panel

When a panel is enabled:

1. Start the container if it is not already running.
2. Show the panel in the UI, making it accessible to users.
3. All of this is handled in the enable/disable API route.

---

## Disabling a Panel

When a panel is disabled:

1. Stop the container to free up system resources.
2. Remove it from the UI, so users no longer see or interact with it.
3. This is also handled in the enable/disable API route.

---

## Notes on Panel Management

- Each panel runs in a separate Docker container, isolating it from other panels and the main BUG server.
- Dockerode is used for all container operations (build, create, start, stop, remove).
- Panel enable/disable logic ensures that containers are only running when needed, improving scalability and performance.
- The UI does not communicate directly with containers for startup — all interactions happen through the main server API.
