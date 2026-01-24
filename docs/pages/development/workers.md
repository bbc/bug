---
title: Workers
parent: Development
nav_order: 2
---

# Workers

Workers are background tasks that run concurrently within the core BUG application or within a module container. They are commonly used to periodically fetch data from devices or services and update the database.

Any JavaScript file placed inside a `workers` folder at the root of a module will be automatically run by the centrally available Worker Manager.

---

## Worker Structure

- Each task should be implemented as a **separate worker file**. This keeps code modular and avoids a single worker consuming excessive memory.
- Workers receive a `workerData` object from the Worker Manager, which usually includes the panel ID and any configuration or parameters the worker needs.
- Use `async/await` where possible to simplify asynchronous operations.
- Include `console.log` statements for debugging, but use structured messages so logs are clear and searchable.

---

## Lifecycle and Error Handling

- Workers are automatically restarted if they fail unexpectedly.
- Always wrap main logic in a `try/catch` block. Log errors and rethrow or let the Worker Manager handle the restart. For example:

```

try {
const data = await fetchDeviceData();
await mongoSingle.set('deviceStatus', data);
} catch (error) {
console.warn(`worker-fetchDeviceData failed: ${error.stack || error}`);
throw error; // Worker Manager will restart
}

```

- Be mindful of polling intervals and avoid overwhelming the database or external device.

---

## Cross-Panel Data Access

- Workers can fetch data from other panels if needed, but always use **API calls to the other panel** rather than accessing its database directly.
- This ensures **isolation** between panels and avoids race conditions or database corruption.

---

## Best Practices

- Keep each worker **focused on a single responsibility**.
- Avoid long-running synchronous operations; prefer asynchronous functions.
- Use TTLs for any temporary data stored in the database to prevent stale entries.
- Test workers independently before deploying them in a module container.

---

Workers provide a reliable and scalable way to handle background tasks across BUG modules and the core system, while keeping the UI responsive and the system modular.

```

```
