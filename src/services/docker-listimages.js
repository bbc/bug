"use strict";

const logger = require("@utils/logger")(module);
const docker = require("@utils/docker");
const cacheStore = require("@core/cache-store");

module.exports = async () => {
    const cacheKey = "dockerListImages";

    // check the cache first
    let response = cacheStore.get(cacheKey);
    if (!response) {
        response = [];
        try {
            const images = await docker.listImages();
            for (var eachImage of images) {
                let module = null;
                if (eachImage.RepoTags && eachImage.RepoTags.length > 0) {
                    module = eachImage.RepoTags[0].split(":")[0];
                }
                response.push({
                    id: eachImage["Id"],
                    module: module,
                    tag: eachImage.RepoTags[0],
                    created: eachImage["Created"],
                    parentId: eachImage["ParentId"],
                    size: eachImage["Size"],
                    virtualSize: eachImage["VirtualSize"],
                });
            }
        } catch (error) {
            logger.error(`${error.stack || error.trace || error || error.message}`);
            throw new Error(`Failed to list images`);
        }
        cacheStore.set(cacheKey, response, 5);
    }
    return response;
};
