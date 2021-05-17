"use strict";

/**
 * core/status-checkworkers.js
 * Checks the status of nodejs workers
 * Returns an array containing a single StatusItem if one or more isn't running, empty array othwerwise
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

 const workerStore = require('@core/worker-store');
 const StatusItem = require("@core/StatusItem");

//TODO - add caching

module.exports = async () => {
    for (let eachWorker of workerStore.workers) {
        try {
            await eachWorker.getHeapSnapshot();
        } catch (error) {
            return [
                new StatusItem({
                    key: "workersnotrunning",
                    message: "One or more worker processes are not running",
                    type: "critical",
                    timestamp: Date.now(),
                }),
            ];
        }
    }
    return [];
};
