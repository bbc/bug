---
title: Status Handling
parent: Development
nav_order: 2
layout: page
---

# Status Handling

Modules should implement a status endpoint. This is used by the application to generate the colored alerts on the home page and toolbar.

In containerised modules, the status route usually delegates to one or more status services. The most common pattern is:

- a `status-getdefault` service that describes the current DB-backed module state when the panel is healthy
- one or more heartbeat or freshness checks that report stale, missing, or failed telemetry
- a `status-get` aggregator that combines those results into a single array

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

While you can return an empty array `[]` if there is absolutely no data to report, you should usually return a `default` status item. This confirms to the UI that the panel is configured and running correctly, and provides useful feedback to the user about the current module state.

**Example Preferred Response:**

```json
{
    "status": "success",
    "data": [
        {
            "key": "defaultservice",
            "message": "Panel is configured and running with 27 service(s)",
            "type": "default",
            "timestamp": 1638349987832,
            "flags": []
        }
    ]
}
```

### 2. Problem State (Active Alerts)

When reporting issues, return an array containing the relevant error types:

```json
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
```

### Field Definitions

| Name          | Description                                                                                |
| ------------- | ------------------------------------------------------------------------------------------ |
| **key**       | A unique string identifier for the specific alert.                                         |
| **message**   | A string or an array of strings. Use an array when you want a headline plus extra detail.  |
| **type**      | One of: `default`, `success`, `info`, `warning`, `error`, `critical`.                      |
| **timestamp** | A Javascript timestamp (ms) representing when the alert was generated.                     |
| **flags**     | An array of action triggers. Supported: `restartPanel`, `configurePanel`, `viewPanelLogs`. |

---

## StatusItem And Module Status

Each entry in the `data` array is a status item. In code, these are usually created with `@core/StatusItem`.

Use status items to describe what the module currently knows about itself:

- whether the panel is configured and actively polling or connected
- whether the database contains usable data
- whether telemetry is stale or missing
- whether user action is required

A module can return multiple status items at the same time. In practice, the most useful pattern is to return one default item describing the current state, plus zero or more warning or critical items describing problems.

## `status-getdefault`

`status-getdefault` is the conventional service used to build the module's normal or healthy status item.

It should usually:

- read the current DB-backed state for the module
- summarise that state in one short human-readable message
- return a `StatusItem` with `type: "default"` and `key: "defaultservice"`
- catch operational errors, log them, and return `[]`

Typical examples include:

- `Module active with 12 codec record(s)`
- `Device active with 42 DHCP lease(s) found`
- `Last test: 93.2Mb/s down, 18.1Mb/s up`

The purpose of `status-getdefault` is not to raise alarms. Its job is to explain the module's current baseline state when things are working or at least usable.

## Heartbeat Checks

Heartbeat checks are the complementary pattern to `status-getdefault`. They detect whether the data or connection that the module depends on is still fresh enough to trust.

Heartbeat checks commonly answer questions like:

- has the worker written fresh data recently?
- has the device stopped responding?
- is the database missing the expected collection or single-value record?
- has a background task stalled?

These checks often use helpers such as `status-checkmongosingle` or similar status-check services. They should return status items for degraded states and `[]` when the heartbeat is healthy.

In many modules, a heartbeat check should be the thing that raises `warning`, `error`, or `critical` items, not `status-getdefault`.

## Patterns Of Use

The common service layout for status handling is:

1. `status-getdefault.js` returns the baseline `default` status item.
2. One or more `status-check...` services evaluate freshness, reachability, or operational health.
3. `status-get.js` concatenates those results and returns the final array for the route.

Example:

```javascript
const statusGetDefault = require("./status-getdefault");
const statusCheckMongoSingle = require("@core/status-checkmongosingle");

module.exports = async () => {
    return [].concat(
        await statusGetDefault(),
        await statusCheckMongoSingle({
            collectionName: "codecs",
            message: ["There is no recent codec data for this service.", "Check your settings."],
            itemType: "critical",
            timeoutSeconds: 60,
            flags: ["restartPanel", "configurePanel"],
        })
    );
};
```

Recommended behaviour:

- keep the route thin and return `{ status: "success", data: await statusGet() }`
- let normal command and query services throw on real failures
- treat status services differently: convert expected health outcomes into status items
- for status-check services, catch operational errors, log them, and return `[]`
- use `default` for the baseline state and reserve `warning` or `critical` for actionable problems

## Implementation Example

The `@core/StatusItem` helper class validates and assists in creating this response.

```javascript
const StatusItem = require("@core/StatusItem");
const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const logger = require("@core/logger")(module);

const statusGetDefault = async () => {
    const services = await getServices();

    return new StatusItem({
        key: "defaultservice",
        message: `Panel is configured and running with ${services.length} service(s)`,
        type: "default",
        flags: [],
    });
};

module.exports = async () => {
    try {
        return [].concat(
            await statusGetDefault(),
            await statusCheckMongoSingle({
                collectionName: "services",
                message: ["There is no recent service data.", "Check your connection settings."],
                itemType: "critical",
                timeoutSeconds: 60,
                flags: ["restartPanel", "configurePanel"],
            })
        );
    } catch (err) {
        logger.error(err.stack || err.message);
        return [];
    }
};
```

This split keeps the healthy-state summary separate from stale-data alarms, which makes status output easier to read and maintain.
