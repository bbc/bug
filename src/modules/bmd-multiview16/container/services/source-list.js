"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const labels = await mongoSingle.get("input_labels");
        return labels ? Object.values(labels) : [];
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};
