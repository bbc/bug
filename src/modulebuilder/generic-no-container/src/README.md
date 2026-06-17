# <%= longname %>

## Overview

<%= description || "TODO: Add a brief module overview." %>

## Configuration

| Field             | Default Value   | Description                                                          |
| ----------------- | --------------- | -------------------------------------------------------------------- |
| `id`              | `""`            | Unique identifier for this module instance (usually auto-generated). |
| `needsConfigured` | `true`          | Indicates whether the module has been configured since build.        |
| `title`           | `""`            | Human-readable title for this module instance, shown in the UI.      |
| `module`          | `"<%= name %>"` | Internal name of the module.                                         |
| `description`     | `""`            | Optional text describing the module instance in the UI.              |
| `notes`           | `""`            | Free-text field for extra notes about this configuration.            |
| `enabled`         | `false`         | Flag indicating whether this module instance is active.              |

## Capabilities

| Type         | List |
| ------------ | ---- |
| **Exposes**  | None |
| **Consumes** | None |

## Development Notes

- This is a client-only template and does not include a container runtime.
- Add screenshots under `assets/` and reference them here if useful.
