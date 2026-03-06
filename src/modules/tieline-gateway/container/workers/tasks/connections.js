"use strict";
const logger = require("@core/logger")(module);
const fetchConnections = require("@utils/fetch-connections");

module.exports = async ({ tielineApi, connectionsCollection }) => {

    try {
        await fetchConnections({ tielineApi, connectionsCollection });
    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        logger.error(error.message);
        throw error;
    }
};