"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async (pendingStatus) => {
    try {
        logger.info(`setting pending status to ${pendingStatus ? "true" : "false"}`);
        await mongoSingle.set("pending", pendingStatus, 60);
    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
