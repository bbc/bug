"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    let config;
    let sources;
    try {
        config = await configGet();
        sources = config.sourceNames;
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`matrix-getallsources: failed to fetch config`);
        return null;
    }

    return sources;
};
