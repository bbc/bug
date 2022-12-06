"use strict";

const logger = require("@utils/logger")(module);
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    try {
        const result = await mongoSingle.get("systemHealth");
        return {
            data: result?.host,
        };
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to retrieve host health details`);
    }
};
