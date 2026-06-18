"use strict";

const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const testCollection = await mongoCollection("test-results");
        const result = await testCollection.findOne({}, { sort: { timestamp: -1 } });
        return { data: result };
    } catch (error) {
        logger.error(`failed to fetch test status: ${error.message}`);
        return { error: error };
    }
};
