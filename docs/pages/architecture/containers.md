---
title: Containers
parent: Architecture
nav_order: 0
layout: page
---

# Containers

## Containers Overview

Every BUG instance includes at minimum:

- BUG Core – serves the frontend UI, manages configuration, and orchestrates modules.
- Mongo – stores persistent configuration and module data.

```mermaid
%%{init: {'flowchart': {'rankSpacing': 70, 'nodeSpacing': 30}} }%%
graph TB
    subgraph host["BUG Host — 192.168.0.1"]
        subgraph core["Main Containers"]
            app["BUG Application\nbug/app:latest"]
            mongo["Mongo DB\nmongo:latest"]
        end
        subgraph modules["Module Containers"]
            m1["ciscosg:latest"]
            m2["comrex-briclink:latest"]
            m3["mikrotik-interfaces:latest"]
            m4["tieline-gateway:latest"]
        end
        app --> mongo
        m1-->app
        m2-->app
        m3-->app
        m4-->app
    end

    t1["Desktop Web Client\n192.168.0.2"] -->|http| app
    device1["Cisco Switch"] <--> m1
    device2["Comrex Briclink Codec"] <--> m2
    device3["Mikrotik Router"] <--> m3
    device4["Tieline Gateway Codec"] <--> m4
```

In development environments, additional containers such as Mongo Express may be present for easier inspection of the database.

Each module is allocated its own container, which provides:

- Isolated environment for backend logic
- Data acquisition and monitoring for connected devices
- REST APIs and WebSocket endpoints for communication with the core
