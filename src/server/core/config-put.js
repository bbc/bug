"use strict";

/**
 * core/config-put.js
 * Encodes config object to JSON and writes to container file - also updates workers
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const writeJson = require("@core/write-json");
const path = require("path");
const logger = require("@core/logger")(module);

module.exports = async (workers, config) => {
    try {
        logger.info(`config-put: received config update`);
        const filename = path.join(__dirname, "..", "config", "panel.json");
        await writeJson(filename, config);
        logger.info(`config-put: saved config file to ${filename}`);

        //Tell the worker manager that a new config is avalible
        if (workers) {
            await workers.pushConfig(config);
        }

        return true;
    } catch (error) {
        logger.error(`config-put: ${error.stack || error || error.message}`);
    }

    return false;
};
