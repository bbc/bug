---
title: Logging
parent: Development
nav_order: 3
---

# Module Logging

In BUG, **all modules should write logs to the console**.  
Logs are primarily viewed via `docker logs` on the command line, but they can also be accessed in the BUG UI via the admin/system panel.
Logging consistently allows you to debug issues and track module behavior in both development and production.

---

## Writing logs

Modules should use the shared `logger` provided by BUG.  
This ensures logs are formatted consistently and include relevant metadata.

Example usage in a service or module:

```js
// Import the logger
const logger = require("../logger");

// Example usage in a service function
async function buildModule(moduleName) {
    try {
        logger.info(`Starting build for module: ${moduleName}`);

        // Some operation
        await performBuild(moduleName);

        logger.info(`Successfully built module: ${moduleName}`);
    } catch (error) {
        logger.warn(`Build failed for module ${moduleName}: ${error.stack || error.message}`);
        throw new Error(`Failed to build module ${moduleName}`);
    }
}
```

Log levels you can use:

- logger.info() — Informational messages about normal operations
- logger.warn() — Warnings about recoverable issues
- logger.error() — Serious errors that may affect functionality
- logger.debug() — Detailed debugging information (optional, for development)

# Viewing logs

Logs are written to the console, so in Docker you can view them using:

```
docker logs <container_name>
```

- Replace `<container_name>` with the name of your BUG container.
- Logs can also be tailed in real time:

```
docker logs -f <container_name>
```

While the BUG UI can display logs for convenience, the command line is the primary way to monitor module activity.

# Best practices

- Always log at the start and end of major operations
- Only debug log (if at all) for regularly called endpoints or services (get/list etc)
- Include relevant identifiers (module name, panel ID, etc.)
- Don’t swallow errors — log them and throw them to propagate to the API layer
- Use structured messages when possible for easier parsing and filtering
