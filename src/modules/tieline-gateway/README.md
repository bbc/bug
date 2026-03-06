# Tieline Gateway

## Overview

The tieline-gateway module provides control of Tieline's audio codec, including program managment, connection and parameter adjustment.
One of the main features is the ability to change connection parameters which other connections in the same group are already connected.

It also provides per-connection and overall statistics, as well as device alarms.

![Screenshot](./assets/screenshot1.png)
![Screenshot](./assets/screenshot2.png)
![Screenshot](./assets/screenshot3.png)
![Screenshot](./assets/screenshot4.png)

## Configuration

| Field             | Default Value       | Description                                                          |
| ----------------- | ------------------- | -------------------------------------------------------------------- |
| `id`              | `""`                | Unique identifier for this module instance (usually auto-generated). |
| `needsConfigured` | `true`              | Indicates whether the module has been configured since build.        |
| `title`           | `""`                | Human-readable title for this module instance, shown in the UI.      |
| `module`          | `"tieline-gateway"` | Internal name of the module.                                         |
| `description`     | `""`                | Optional text describing the module instance in the UI.              |
| `notes`           | `""`                | Free-text field for extra notes about this configuration.            |
| `address`         | `""`                | IP address or hostname of the MikroTik router to connect to.         |
| `username`        | `"bug"`             | Username used to authenticate with the MikroTik router.              |
| `password`        | `""`                | Password for the router user.                                        |
| `enabled`         | `false`             | Flag indicating whether this module instance is active.              |

---

## Capabilities

This module follows BUG’s standard capabilities model. For more information, see [BUG Capabilities Documentation]({DOCS_BASEURL}bug/pages/development/capabilities.html).

| Type         | List     |
| ------------ | -------- |
| **Exposes**  | None     |
| **Consumes** | codec-db |

---
