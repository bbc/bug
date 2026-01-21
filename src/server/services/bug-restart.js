"use strict";

const logger = require("@utils/logger")(module);
const dockerListContainerInfo = require("@services/docker-listcontainerinfo");
const dockerRestartContainer = require("@services/docker-restartcontainer");
const docker = require("@utils/docker");
const bugContainer = process.env.BUG_CONTAINER || "bug";

module.exports = async () => {
    try {
        logger.info(`BUG is restarting...`);
        const containerInfoList = await dockerListContainerInfo();
        for (let eachContainer of containerInfoList) {
            if (!eachContainer.image.includes(bugContainer)) {
                const container = docker.getContainer(eachContainer.name);
                await dockerRestartContainer(container);
            }
        }
        const container = docker.getContainer(bugContainer);
        await dockerRestartContainer(container);
    } catch (error) {
        logger.error(`${error?.stack || error?.trace || error || error?.message}`);
        throw new Error(`Failed to restart BUG`);
    }
    return null;
};
