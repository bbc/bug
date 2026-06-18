"use strict";

const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");
const testStatusClean = require("./test-status-clean");

module.exports = async () => {
    try {
        const [result, schedule] = await Promise.all([
            testStatusClean(),
            mongoSingle.get("test-schedule"),
        ]);

        return {
            data: {
                ...(schedule || {}),
                ...(result || {}),
            },
        };
    } catch (error) {
        logger.error(`failed to fetch test status: ${error.message}`);
        return { error: error };
    }
};
