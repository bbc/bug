"use strict";

const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const testCollection = await mongoCollection("test-results");
        const { deletedCount } = await testCollection.deleteMany({});
        return { deletedCount: deletedCount };
    } catch (error) {
        logger.error(`failed to delete all test results: ${error.message}`);
        throw error;
    }
};
