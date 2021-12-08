---
layout: page
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

Then in services - we should log and throw:

```
    } catch (error) {
        logger.warn(`module-build: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to build module ${moduleName}`);
    }
```

Inside a service, if you want to stop execution because a step has failed, use:

```
throw new Error(`Failed to write dockerfile to '${modulePath}'`);
```
