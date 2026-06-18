"use strict";

const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");

module.exports = async (resultsLimit = 10) => {
    try {
        const testCollection = await mongoCollection("test-results");
        const results = await testCollection
            .find({}, { sort: { timestamp: -1 } })
            .limit(parseInt(resultsLimit))
            .toArray();
        return { data: results };
    } catch (error) {
        logger.error(`failed to fetch test results: ${error.message}`);
        return { error: error };
    }
};
