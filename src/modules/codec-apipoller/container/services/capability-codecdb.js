"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    try {
        return await mongoSingle.get("codecs");
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};
