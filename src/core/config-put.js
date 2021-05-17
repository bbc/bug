"use strict";

/**
 * core/config-put.js
 * Encodes config object to JSON and writes to container file - also updates workers
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const writeJson = require("@core/write-json");
const workerStore = require("@core/worker-store");
const path = require("path");

module.exports = async (config) => {
    try {
        console.log(`config-put: received config update`);
        const filename = path.join(__dirname, "..", "config", "panel.json");
        await writeJson(filename, config);
        console.log(`config-put: saved config file to ${filename}`);

        //Tell the worker manager that a new config is avalible
        await workerStore.pushConfig(config);

        return true;
    } catch (error) {
        console.log(`config-put: ${error.trace || error || error.message}`);
    }

    return false;
};
