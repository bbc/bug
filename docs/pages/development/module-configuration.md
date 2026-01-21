---
layout: page
title: Module Configuration
parent: Development
nav_order: 2
---

# Module Configuration

BUG modules support persistent configuration that is **separate from live data**. This page outlines the recommended patterns and tools for module configuration.

---

## Config Panels

-   Each module must include a `ConfigPanel.jsx` file.
-   This panel is loaded via the route:

```
/panel/[panelid]/config
```

-   Use the core `BugConfigForm` controls to build your configuration form.
-   Other modules in the repository serve as good examples for layout and usage.

### UI Guidelines

-   Use the Material-UI `'standard'` variant for config pages and forms.
-   Use `'outlined'` for controls in main pages or for direct control of devices.
-   For complex data (arrays, objects), feel free to create custom UI elements like modal dialogs. The main config form is generally reserved for startup settings (IP, username, password) and minor fields.

---

## Module JSON

-   Each module has a `module.json` file in its folder.
-   This file contains the starting configuration for the module.
-   All custom config fields should be optional, and your code must handle missing or null values gracefully.

---

## Persistence and Storage

-   Config changes are persistent and written to a JSON file.
-   The file is mapped via a volume to your local disk, making it easy to backup or migrate.
-   Do not use config for live or real-time data; it is meant for settings that persist across restarts.

---

## Updating Config Programmatically

-   You can update config via your module services using this service:

```
@core/config-putviacore
```

-   This uses the backend API to write the config file.
-   It is preferable to writing the file yourself, because it ensures:
-   The JSON file is updated correctly.
-   The central config cache is invalidated automatically.

---

Following these guidelines ensures that module configuration is consistent, reliable, and easy to manage, both for developers and for deployment across environments.
