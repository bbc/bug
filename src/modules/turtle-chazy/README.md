# Turtle Chazy Control

## Overview

This module provides Dante audio routing control via a Turtle Chazy Dante controller.

Features:

- discovers all Dante devices on the network via the controller
- displays sources and destinations per device
- make audio routes between Dante devices
- optional 'use take' setting which requires two clicks to make a route

## Configuration

| Field             | Default Value    | Description                                                          |
| ----------------- | ---------------- | -------------------------------------------------------------------- |
| `id`              | `""`             | Unique identifier for this module instance (usually auto-generated). |
| `needsConfigured` | `true`           | Indicates whether the module has been configured since build.        |
| `title`           | `""`             | Human-readable title for this module instance, shown in the UI.      |
| `module`          | `"turtle-chazy"` | Internal name of the module.                                         |
| `description`     | `""`             | Optional text describing the module instance in the UI.              |
| `notes`           | `""`             | Free-text field for extra notes about this configuration.            |
| `address`         | `""`             | IP address or hostname of the Turtle Chazy controller.               |
| `useTake`         | `false`          | Whether to require an extra 'take' action when making a route.       |
| `enabled`         | `false`          | Whether the module instance is enabled.                              |
| `url`             | `""`             | Optional URL associated with this module instance.                   |

---

## Capabilities

This module does not expose or consume any BUG capabilities.

---

## Device Configuration

No special device configuration is required on the Turtle Chazy controller.

The module communicates with the controller over HTTP on port 80. Ensure the controller is reachable from the BUG host at the configured IP address.

---

## Troubleshooting

- Verify the controller's IP address is correct and reachable from BUG.
- Check that the Dante network is healthy and devices are visible in the controller's web interface.
- If no sources or destinations appear, confirm the controller is returning device data from its API.
