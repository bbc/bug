"use strict";

const logger = require("@utils/logger")(module);
const dockerListContainerInfo = require("@services/docker-listcontainerinfo");
const dockerStopContainer = require("@services/docker-stopcontainer");
const docker = require("@utils/docker");
const bugContainer = process.env.BUG_CONTAINER || "bug";

module.exports = async () => {
    try {
        logger.info(`BUG is shutting down...`);
        const containerInfoList = await dockerListContainerInfo();
        for (let eachContainer of containerInfoList) {
            if (eachContainer.image !== "bbcnews-bug_app") {
                const container = docker.getContainer(eachContainer.name);
                await dockerStopContainer(container);
            }
        }
        const container = docker.getContainer(bugContainer);
        await dockerStopContainer(container);
    } catch (error) {
        logger.error(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to get modules folder`);
    }
    return null;
};
