# <%= longname %>

## Overview

<%= description || "TODO: Add a brief module overview." %>

This module template targets network switch monitoring and control.

## Configuration

| Field                 | Default Value   | Description                                                          |
| --------------------- | --------------- | -------------------------------------------------------------------- |
| `id`                  | `""`            | Unique identifier for this module instance (usually auto-generated). |
| `needsConfigured`     | `true`          | Indicates whether the module has been configured since build.        |
| `title`               | `""`            | Human-readable title for this module instance, shown in the UI.      |
| `module`              | `"<%= name %>"` | Internal name of the module.                                         |
| `description`         | `""`            | Optional text describing the module instance in the UI.              |
| `notes`               | `""`            | Free-text field for extra notes about this configuration.            |
| `enabled`             | `false`         | Flag indicating whether this module instance is active.              |
| `address`             | `""`            | IP address or hostname of the device to connect to.                  |
| `username`            | `"bug"`         | Username used to authenticate with the device.                       |
| `password`            | `""`            | Password for the device user.                                        |
| `protectedInterfaces` | `[]`            | Interfaces marked protected against accidental changes.              |
| `dhcpSources`         | `[]`            | Panel IDs that provide the `dhcp-server` capability.                 |

## Capabilities

| Type         | List        |
| ------------ | ----------- |
| **Exposes**  | None        |
| **Consumes** | dhcp-server |

## Development Notes

- Container runtime source is in `container/`.
- Client source is in `client/`.
