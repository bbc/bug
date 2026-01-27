"use strict";

const logger = require("@utils/logger")(module);
const dockerGetContainer = require("@services/docker-getcontainer");
const coreName = process.env.BUG_CONTAINER || "bug";
const cacheStore = require("@core/cache-store");

module.exports = async () => {
    try {
        const cacheKey = "coreSourceFolder";

        // check the cache first
        const sourceFolder = cacheStore.get(cacheKey);
        if (sourceFolder) {
            return sourceFolder;
        }

        const container = await dockerGetContainer(coreName);
        if (!container) {
            return null;
        }

        const moduleInspect = await container.inspect();

        if ("Mounts" in moduleInspect) {
            for (let eachMount of moduleInspect.Mounts) {
                if (eachMount["Destination"].indexOf(coreName) > -1) {
                    // store in cache
                    cacheStore.set(cacheKey, eachMount["Source"]);

                    // return value
                    return eachMount["Source"];
                }
            }
        }
    } catch (error) {
        logger.error(`docker-getsourcefolder: ${error?.stack}`);
        throw new Error(`Failed to get modules folder`);
    }
    return null;
};
