---
title: Architecture
nav_order: 6
has_children: false
---

# Architecture

BUG is built around a modular, containerized architecture designed to simplify control and monitoring of broadcast equipment. Understanding the assumptions and principles of this architecture is important when developing new modules.

## Core Principles

- Each module is self-contained: one module per function.
- Modules are designed to be independent but can interact via APIs if needed.
- Focus on simplicity: aim to implement ~80% of a device’s functionality.
- BUG is mobile-first: UI components are designed to scale across screen sizes.
- Performance matters: consider the load on devices and frequency of data polling.
- Modules run in Docker containers, isolating their backend logic from the core system.
- Module memory is volatile: any temporary data should not be relied upon for persistent state.

## Containers Overview

Every BUG instance includes at minimum:

- BUG Core – serves the frontend UI, manages configuration, and orchestrates modules.
- Mongo – stores persistent configuration and module data.

![Architecture Overview](/bug/assets/diagrams/architecture-overview.drawio.svg)

In development environments, additional containers such as Mongo Express may be present for easier inspection of the database.

Each module is allocated its own container, which provides:

- Isolated environment for backend logic
- Data acquisition and monitoring for connected devices
- REST APIs and WebSocket endpoints for communication with the core

## Panel Communication

![Panel Communication](/bug/assets/diagrams/panel-communication.drawio.svg)

Panels communicate only with the BUG Core API. Workers within module containers fetch data directly from devices or external services and write to the module’s Mongo database. The frontend reads data from the BUG Core, not directly from devices or module containers.

### Key Points

- Workers handle device communication asynchronously.
- The frontend interacts only with BUG Core, not module containers.
- Central Mongo databases are per-panel and facilitate sharing data between workers.
- NodeCache or other local caches can be used within containers for temporary data.

## Module Configuration

Panel configuration is persistent and stored in BUG Core. Module containers receive their configuration when started or updated.

- Each module should provide a base config page accessible at `/config`.
- Config forms should use the `PanelConfig` component to ensure consistent behavior:

```

<PanelConfig>
  <!-- form fields -->
</PanelConfig>
```

- The API route `/api/panel/config/${panelId}` accepts a PUT request with a config object.
- Valid fields are merged with existing configuration; invalid fields are ignored.
- Field validation is the responsibility of the module developer.

Persistent configuration includes things like IP addresses, credentials, or default module options. Temporary runtime data should be stored in the module’s container database or cache.

## Module Memory is Volatile

Anything stored in a module’s container during runtime should not be considered permanent. Containers can be restarted, rebuilt, or removed at any time.

- Design modules to function correctly even if runtime data is lost.
- Persistent config should always be stored in BUG Core and passed to the module container.
- Use the panel-specific Mongo database for temporary or frequently-updated data.

---

This architecture ensures that BUG remains scalable, modular, and resilient while providing clear boundaries between persistent configuration, frontend UI, and module runtime logic.
