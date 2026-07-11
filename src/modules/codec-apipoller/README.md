# Codec API-Poller

## Overview

The codec-apipoller module polls a remote API endpoint for codec records and displays the returned data in a filterable BUG table.

The container polls the configured API URL every 300 seconds using an HTTP `POST` request. When the response body is an array, the module stores the returned codec records and exposes them to the panel UI.

## Features

- filterable codec table in the main panel
- sortable columns for codec name, address, port, and selected nested device fields
- dropdown filters for zone, capabilities, and device tags
- admin-only configuration panel
- codec database capability output from the stored codec list
- panel status check for recent codec data availability

## Configuration

| Field             | Default Value       | Description                                                         |
| ----------------- | ------------------- | ------------------------------------------------------------------- |
| `id`              | `""`                | Unique identifier for the module instance.                          |
| `order`           | `0`                 | Display order of the panel in the dashboard.                        |
| `needsConfigured` | `true`              | Indicates that the module requires configuration before use.        |
| `title`           | `""`                | Human-readable panel title shown in the UI.                         |
| `module`          | `"codec-apipoller"` | Internal module name.                                               |
| `description`     | `""`                | Optional descriptive text for the panel.                            |
| `notes`           | `""`                | Optional free-text notes.                                           |
| `enabled`         | `false`             | Enables or disables the module instance.                            |
| `url`             | `""`                | Remote API endpoint to poll for codec data. This field is required. |

## Panel Data

The main panel displays codec records from the polled API response with these visible fields:

- `Name`
- `Zone`
- `Capabilities`
- `Address`
- `Port`
- `Device Tags`
- `Device` (`manufacturer` + `model`)

The table requests option lists for `zone`, `capabilities`, and `device.tags` so those values can be used as dropdown filters.

## Codec Data Schema

The polled API endpoint is expected to return a JSON array of codec endpoints.

```json
[
    {
        "id": "my-codec-endpoint-id",
        "name": "My Codec SRT 01 (internet)",
        "capabilities": ["srt", "h264", "aac"],
        "address": "10.1.1.2",
        "port": 6000,
        "zone": "internet",
        "device": {
            "hostname": "my-codec-01",
            "name": "My Codec 01",
            "location": "My Location",
            "tags": ["decoder"],
            "description": "My nice rackmount codec",
            "model": "CD1234",
            "manufacturer": "Codec Inc",
            "notes": "Main Path 1"
        }
    }
]
```

### Top-Level Fields

| Field          | Type             | Description                                       |
| -------------- | ---------------- | ------------------------------------------------- |
| `id`           | string           | Unique identifier for the codec endpoint record.  |
| `name`         | string           | Display name shown in the panel.                  |
| `capabilities` | array of strings | Capability labels used for display and filtering. |
| `address`      | string           | Codec IP address or hostname.                     |
| `port`         | number           | Codec service port.                               |
| `zone`         | string           | Logical grouping used for display and filtering.  |
| `device`       | object           | Additional metadata about the underlying device.  |

### `device` Fields

| Field          | Type             | Description                       |
| -------------- | ---------------- | --------------------------------- |
| `hostname`     | string           | Device hostname.                  |
| `name`         | string           | Human-readable device name.       |
| `location`     | string           | Device location text.             |
| `tags`         | array of strings | Device tags used for filtering.   |
| `description`  | string           | Short description of the device.  |
| `model`        | string           | Device model name or number.      |
| `manufacturer` | string           | Device manufacturer name.         |
| `notes`        | string           | Free-text notes about the device. |

The module currently uses these fields for filtering and sorting when present:

- `name`
- `zone`
- `capabilities`
- `address`
- `port`
- `device.name`
- `device.location`
- `device.tags`
- `device.description`
- `device.model`
- `device.manufacturer`
- `device.notes`

## Capabilities

This module follows BUG's standard capabilities model. For more information, see [BUG Capabilities Documentation]({DOCS_BASEURL}bug/pages/development/capabilities.html).

| Type         | List       |
| ------------ | ---------- |
| **Exposes**  | `codec-db` |
| **Consumes** | None       |

## Troubleshooting

**No codecs appear in the table**

Check that the module is enabled and that `url` points to a reachable API endpoint returning an array of codec objects.

**The panel shows a status warning or critical state**

The status check reports when no recent codec data has been stored. Verify that the API endpoint is reachable and that the polling worker is running.
