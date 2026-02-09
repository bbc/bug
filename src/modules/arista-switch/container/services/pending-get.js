"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        return mongoSingle.get("pending");
    } catch (err) {
        err.message = `pending-get: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
