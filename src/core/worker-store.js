"use strict";

/**
 * core/worker-store.js
 * Shared access to the worker manager
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const WorkerManager = require("@core/WorkerManager");

let manager;

const instantiate = () => {
    manager = new WorkerManager();
};

instantiate();

module.exports = manager;
