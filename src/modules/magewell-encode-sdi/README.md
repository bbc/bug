# Magewell Encoder

## Overview

Control and monitoring of Magewell SRT encoders

## Configuration

| Field             | Default Value           | Description                                                          |
| ----------------- | ----------------------- | -------------------------------------------------------------------- |
| `id`              | `""`                    | Unique identifier for this module instance (usually auto-generated). |
| `needsConfigured` | `true`                  | Indicates whether the module has been configured since build.        |
| `title`           | `""`                    | Human-readable title for this module instance, shown in the UI.      |
| `module`          | `"magewell-encode-sdi"` | Internal name of the module.                                         |
| `description`     | `""`                    | Optional text describing the module instance in the UI.              |
| `notes`           | `""`                    | Free-text field for extra notes about this configuration.            |
| `enabled`         | `false`                 | Flag indicating whether this module instance is active.              |

## Capabilities

| Type         | List |
| ------------ | ---- |
| **Exposes**  | None |
| **Consumes** | None |

## Development Notes

- Container runtime source is in `container/`.
- Client source is in `client/`.
