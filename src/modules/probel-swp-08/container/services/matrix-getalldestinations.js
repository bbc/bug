"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    let config;
    let destinations;
    try {
        config = await configGet();
        destinations = config.destinationNames;
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`matrix-getalldestinations: failed to fetch config`);
        return null;
    }

    return destinations;
};
