"use strict";

const destinationRoute = require("@services/destination-route");
const delay = require("delay");
const deviceConfigSet = require("@services/deviceconfig-set");
const logger = require("@core/logger")(module);

module.exports = async (sourceIndex) => {
    try {
        await destinationRoute(16, sourceIndex);
        await delay(500);
        await deviceConfigSet("Solo enabled", "true");
        await delay(500);
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};
