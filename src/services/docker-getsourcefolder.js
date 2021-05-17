"use strict";

const logger = require("@utils/logger")(module);
const dockerGetContainer = require("@services/docker-getcontainer");
const coreName = process.env.DOCKER_CORE_NAME || "bug-core";
const path = require("path");

module.exports = async () => {
    try {
        //TODO cache!
        const container = await dockerGetContainer(coreName);
        const moduleInspect = await container.inspect();

        if ("Mounts" in moduleInspect) {
            for (let eachMount of moduleInspect.Mounts) {
                if (eachMount["Destination"].indexOf(coreName) > -1) {
                    return eachMount["Source"];
                }
            }
        }
    } catch (error) {
        logger.error(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to get modules folder`);
    }
    return null;
};
