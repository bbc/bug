"use strict";

/**
 * core/status-checkworkers.js
 * Checks the status of nodejs workers
 * Returns an array containing a single StatusItem if one or more isn't running, empty array othwerwise
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const workerStore = require("@core/worker-store");
const StatusItem = require("@core/StatusItem");
const cacheStore = require("@core/cache-store");

module.exports = async () => {
    const status = [];
    const cacheKey = "workersState";

    // check the cache first, return contents if avalible
    const cacheContents = cacheStore.get(cacheKey);
    if (cacheContents) {
        return cacheContents;
    }

    // loop through the workers and attempt to fetch info (throws an error if not running)
    const workers = await workerStore.getWorkers();

    for (let worker of workers) {
        if (worker?.state !== "running") {
            status.push(
                new StatusItem({
                    key: "workersnotrunning",
                    message: `${worker.filename} is not running`,
                    type: "error",
                })
            );
        }
    }

    // cache the result for 10 seconds
    cacheStore.set(cacheKey, status, 10);
    return status;
};
