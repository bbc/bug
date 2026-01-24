---
title: Error Handling
parent: Development
nav_order: 2
---

# Module Error Handling

Express doesn't handle async/await errors properly with an `errorhandler` - we need to use `express-async-handler`:

```
router.get(
    "/quote",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await bugQuote(),
        });
    })
);
```

Any error thrown inside the async function will automatically be passed to Express’s error handler.

# Throwing errors in services

Inside module services, log the error and then throw a new one.
This ensures it’s visible in logs and propagated to the router:

```
    try {
        await buildModule(moduleName);
    } catch (error) {
        logger.warn(`module-build: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to build module ${moduleName}`);
    }
```

If a step fails and you want to stop execution immediately, simply throw an error:

```
throw new Error(`Failed to write dockerfile to '${modulePath}'`);
```
