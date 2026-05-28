---
title: Error Handling
parent: Development
nav_order: 2
layout: page
---

# Module Error Handling

This page documents the current BUG module error-handling patterns.

---

## Route-level Error Handling

Wrap async routes with `express-async-handler` so thrown errors are forwarded to Express middleware:

```
const asyncHandler = require("express-async-handler");

router.get("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await entryList(),
    });
}));
```

Do not manually wrap each route with repeated try/catch blocks if a centralized error middleware is in place.

---

## Centralized API Error Middleware

Container API apps should have one final error middleware that:

- prevents double responses when headers are already sent,
- applies a fallback HTTP status (500),
- logs useful error context,
- returns a consistent JSON shape.

Example response format used by `mikrotik-sdwan`:

```
{
  "status": "error",
  "message": "..."
}
```

This keeps client-side Axios helpers and UI behavior consistent across modules.

---

## Service-level Best Practice

In services, use fail-fast validation and explicit errors:

- Validate required input early.
- Validate config/database assumptions (e.g., expected arrays).
- Throw actionable errors with enough context to debug quickly.

Pattern used in `mikrotik-sdwan` services:

```
module.exports = async (routeId) => {
    try {
        if (!routeId) {
            throw new Error("no route id provided");
        }

        // service logic...
        return true;
    } catch (error) {
        error.message = `route-enable: ${error.stack || error.message}`;
        logger.error(error.message);
        throw error;
    }
};
```

Key point: log and rethrow so the route/middleware layer can control the HTTP response.

---

## Worker Error Handling

Workers should fail loudly and exit on unrecoverable errors so the supervisor can restart them.

Recommended behavior:

- Wrap startup/main logic in try/catch.
- Log fatal startup/runtime failures with stack traces.
- Exit non-zero for fatal errors.
- On critical transport disconnects, log and terminate to trigger recovery.

This pattern is used in `worker-mikrotik.js` via `onDisconnect` and top-level `main().catch(...)`.

---

## Status Services

Status-check services are slightly different from command services:

- Return `StatusItem` values (or arrays of them) for degraded states.
- Return `[]` for healthy/no-issue cases.
- Avoid throwing for routine "no data yet" health outcomes.

In `mikrotik-sdwan`, status checks convert stale/missing telemetry into explicit status items instead of crashing request handlers.

---

## Practical Rules

1. Use `express-async-handler` for async routes.
1. Keep one centralized JSON error middleware in the container API app.
1. In services, validate early, log with context, and rethrow.
1. In workers, treat unrecoverable errors as fatal and exit.
1. In status services, report health as status items rather than exceptions where possible.

If a step fails and execution should stop immediately, throw an error:

```
throw new Error("failed to update route cache");
```
