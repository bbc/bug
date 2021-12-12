"use strict";

const docker = require("@utils/docker");
const logger = require("@utils/logger")(module);

module.exports = async (imageName) => {
    try {
        const image = await docker.listImages({
            filters: {
                reference: [imageName],
            },
        });
        return image[0];
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to get list of any image for module ${moduleName}`);
    }
};
