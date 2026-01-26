---
title: Status Handling
parent: Development
nav_order: 2
---

# Status Handling

Modules should implement a status endpoint. This is used by the application to generate the colored alerts on the home page and toolbar.

### Endpoint Configuration

The endpoint must be located at:  
`GET /container/yourpanelid/status`

---

## Status Types

The `type` field determines the visual priority and behavior of the alert.

| Type           | Level    | Description                                                                                              |
| :------------- | :------- | :------------------------------------------------------------------------------------------------------- |
| **`default`**  | Neutral  | **Recommended.** Indicates the panel is configured and running normally (e.g., "27 service(s) running"). |
| **`success`**  | Positive | Shows the device is active (e.g., an active stream). Use sparingly to avoid UI clutter.                  |
| **`info`**     | Neutral  | General information or non-critical updates.                                                             |
| **`warning`**  | Low      | Potential issues that do not stop operation.                                                             |
| **`error`**    | High     | Significant issues requiring attention.                                                                  |
| **`critical`** | Block    | Critical failure. **Makes the panel unavailable for use.**                                               |

---

## Response Structure

### 1. Optimal State (Working)

While you can return an empty array `[]` if there is absolutely no data to report, you should **ideally return a `default` response**. This confirms to the UI that the panel is configured and running correctly, and provides useful feedback to the user.

**Example Preferred Response:**

```json
[
    {
        "status": "success",
        "data": [
            {
                "key": "panel_running",
                "message": ["Panel is configured and running", "27 service(s) running"],
                "type": "default",
                "timestamp": 1638349987832
            }
        ]
    }
]
```

### 2. Problem State (Active Alerts)

When reporting issues, return an array containing the relevant error types:

```json
[
    {
        "status": "success",
        "data": [
            {
                "key": "staleleasesdata",
                "message": [
                    "There is no recent router data for this device.",
                    "Check your connection and authentication settings."
                ],
                "type": "critical",
                "timestamp": 1638349987832,
                "flags": ["restartPanel", "configurePanel"]
            }
        ]
    }
]
```

### Field Definitions

| Name          | Description                                                                                |
| ------------- | ------------------------------------------------------------------------------------------ |
| **key**       | A unique string identifier for the specific alert.                                         |
| **message**   | An array of strings. The first line is the headline; subsequent lines provide detail.      |
| **type**      | One of: `default`, `success`, `info`, `warning`, `error`, `critical`.                      |
| **timestamp** | A Javascript timestamp (ms) representing when the alert was generated.                     |
| **flags**     | An array of action triggers. Supported: `restartPanel`, `configurePanel`, `viewPanelLogs`. |

---

## Implementation Example

The `@core/StatusItem` helper class validates and assists in creating this response.

```javascript
const StatusItem = require("@core/StatusItem");

module.exports = async () => {
    const services = await getServices();
    const result = await checkDeviceStatus();

    // Ideal: Return a default status when working
    if (result && services.length > 0) {
        return [
            new StatusItem({
                key: "service_status",
                message: ["Panel is running", `${services.length} service(s) running`],
                type: "default",
            }),
        ];
    }

    // Return warnings/errors when issues occur
    if (!result) {
        return [
            new StatusItem({
                key: "errorresult",
                message: ["Device has an unspecified error"],
                type: "warning",
            }),
        ];
    }

    return [];
};
```
