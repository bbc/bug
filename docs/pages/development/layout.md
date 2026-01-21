---
layout: page
title: Project Layout
parent: Development
nav_order: 2
---

# Project Layout

This page describes the structure of the BUG project, the purpose of each major folder under `src/`, and how responsibilities are separated across the codebase. BUG’s source is organised to keep frontend, backend, and modules clear and maintainable.

---

## `/src/client`

-   Contains the **frontend application** for BUG.
-   UI code for rendering panels, controls, dashboards, and views.
-   Communicates with the backend using REST APIs and modules.
-   Includes React component logic and assets.

---

## `/src/modulebuilder`

-   Contains code responsible for **creating and managing module scaffolding**.
-   Includes templates or builders that generate module structures.
-   Used internally when generating new modules or updating existing ones.
-   Handles registration and initialization of modules with the server.

---

## `/src/modules`

-   Contains the implementations of all available module types.
-   Each module type contains a `client` and `container` folder:
    -   `client` files are bundled into the main UI build.
    -   `container` files are used to build the Docker image that runs when a panel is created for this module type.
        -   Each Docker container runs a web service exposing its own API endpoints.
        -   You can define any endpoints; however, a few endpoints are **mandatory** (`/api/status`, `/api/config`).

---

## `/src/server`

-   Contains the Node.js code and runs an Express.js server for the main BUG backend application.
-   Provides the API for the user interface and manages panel lifecycle via Docker.
-   Loads modules, orchestrates their lifecycle, and configures middleware, error handling, and global services.

---

This layout keeps BUG **organized and modular**, separating frontend UI, backend API layers, and module logic for easier maintenance and scalable development.
