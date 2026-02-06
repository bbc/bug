"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@utils/logger")(module);

module.exports = async (pendingStatus) => {
    try {
        logger.info(`device-setpending: setting pending status to ${pendingStatus ? "true" : "false"}`);
        await mongoSingle.set("pending", pendingStatus, 60);
    } catch (err) {
        err.message = `device-setpending: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
