"use strict";

const logger = require("@utils/logger")(module);
const dockerPull = require("@services/docker-pull");
const dockerRestartContainer = require("@services/docker-restartcontainer");
const dockerGetContainer = require("@services/docker-getcontainer");
const bugContainer = process.env.BUG_CONTAINER || "app";

module.exports = async () => {
    try {
        const response = {};

        // 1 - Get the container ID
        const container = await dockerGetContainer(bugContainer);
        response.container = container.id;

        // 2 - Restart the BUG application
        await dockerRestartContainer(container);

        return response;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed apply the bug update.`);
    }
};
