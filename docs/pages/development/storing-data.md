---
layout: page
title: Storing Data
parent: Development
nav_order: 2
---

# Storing Module Data

When designing your own module, you will inevitably want to store your data.

Since each module runs in its own container, you are free to use whatever you like, but we recommend:

-   module config for persistent, transferrable settings
-   nodeCache for caching regularly-polled data
-   bug mongo instance for everything else

We investigated various file and process-based local databases but found that none of them provide cross-process access. This is vital when accessing the same data from express (API etc) and your worker threads.

NOTE: Even though you can, we strongly discourage accessing other panels' databases and the bug core database. All cross-panel traffic should be via a web API.

# Using Mongo

There are a few shared components available to allow access to the central database.

# Workers

Please note that if you are accessing the database from a worker, you'll need to connect to the database first. You can use the mongoDb class to do this (using the provided panelId as the database name):

```
const mongoDb = require("@core/mongo-db");

// Connect to the db
await mongoDb.connect(workerData.id);
```

# Mongo Collection

One connected to the database, you can access any collection:

```
const mongoCollection = require("@core/mongo-collection");

// get the collection reference
const interfacesCollection = await mongoCollection("interfaces");
const result = await interfacesCollection.findOne({ "interfaceId": "eth0" });
```

# Mongo Single

This has been provided when a single document or array needs to be stored in the database.
The class creates a new collection with a single document, containing a payload of the supplied data.

Here are some usage examples:

## Setting

```
const mongoSingle = require("@core/mongo-single");
const leases = await mongoSingle.get("leases", ["lease1", "lease2"]);
```

## Getting

```
const mongoSingle = require("@core/mongo-single");
const leases = await mongoSingle.get("leases");
```

# Best Practices

Some things to consider

-   Don't overload the database service - consider using batched writes or local caches
-   Consider how often you need to poll a device - maybe less than you think
-   Use TTLs (available via mongo-createindex.js) to remove stale data
-   Make sure collections are emptied on container restart
