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
    const cacheKey = "workersState";

    // check the cache first
    if (cacheStore.get(cacheKey)) {
        return [];
    }

    try {
        // loop through the workers and attempt to fetch info (throws an error if not running)
        for (let eachWorker of workerStore.workers) {
            await eachWorker.getHeapSnapshot();
        }
    } catch (error) {
        return [
            new StatusItem({
                key: "workersnotrunning",
                message: "One or more worker processes are not running",
                type: "critical",
            }),
        ];
    }

    // cache the result for 10 seconds
    cacheStore.set(cacheKey, true, 10);
    return [];
};
