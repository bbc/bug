"use strict";

const logger = require("@core/logger")(module);
const dockerGetContainer = require("@services/docker-getcontainer");
const coreName = process.env.BUG_CONTAINER || "bug";
const cacheStore = require("@core/cache-store");
const BUG_WORKDIR = process.env.BUG_WORKDIR || "/home/node/bug";
const fs = require("fs");
const path = require("path");

const isProjectRootPath = (folderPath) => {
    if (!folderPath) {
        return false;
    }
    return fs.existsSync(path.join(folderPath, "src", "server", "core"))
        && fs.existsSync(path.join(folderPath, "src", "modules"));
};

module.exports = async () => {
    try {
        const cacheKey = "coreSourceFolder";

        // check the cache first
        const sourceFolder = cacheStore.get(cacheKey);
        if (sourceFolder) {
            if (isProjectRootPath(sourceFolder)) {
                return sourceFolder;
            }

            logger.warning(`invalid cached source folder detected for container ${coreName}, resetting cache: ${sourceFolder}`);
            cacheStore.del(cacheKey);
        }

        const container = await dockerGetContainer(coreName);
        if (!container) {
            return null;
        }

        const moduleInspect = await container.inspect();

        if ("Mounts" in moduleInspect) {
            // Prefer the bind mount for the bug working directory (e.g. .:/home/node/bug).
            const preferredMount = moduleInspect.Mounts.find(eachMount => eachMount?.Destination === BUG_WORKDIR && eachMount?.Type === "bind");
            if (preferredMount?.Source) {
                cacheStore.set(cacheKey, preferredMount.Source);
                return preferredMount.Source;
            }

            // Fallback for legacy setups: first bind mount that targets a path containing the container name.
            const fallbackMount = moduleInspect.Mounts.find(eachMount => eachMount?.Type === "bind" && eachMount?.Destination?.indexOf(coreName) > -1);
            if (fallbackMount?.Source) {
                cacheStore.set(cacheKey, fallbackMount.Source);
                return fallbackMount.Source;
            }

            logger.warning(`unable to identify source folder mount from container ${coreName}. mount destinations: ${JSON.stringify(moduleInspect.Mounts.map(m => m?.Destination))}`);
        }
    } catch (error) {
        logger.error(`${error?.stack}`);
        throw new Error(`Failed to get modules folder`);
    }
    return null;
};
