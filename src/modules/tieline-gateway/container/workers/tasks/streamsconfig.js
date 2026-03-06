"use strict";
const logger = require("@core/logger")(module);
const fetchStreamsConfig = require("@utils/fetch-streamsconfig");

module.exports = async ({ tielineApi, mongoSingle }) => {
    try {
        await fetchStreamsConfig({ tielineApi, mongoSingle });
    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        logger.error(error?.message || error);
        throw error;
    }
};


