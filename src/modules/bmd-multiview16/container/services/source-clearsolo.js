"use strict";

const deviceConfigSet = require("@services/deviceconfig-set");
const delay = require("delay");
const logger = require("@utils/logger")(module);

module.exports = async () => {
    try {
        await deviceConfigSet("Solo enabled", "false");
        await delay(500);
    } catch (err) {
        err.message = `source-clearsolo: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
