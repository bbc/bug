"use strict";

const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");
const ObjectId = require("mongodb").ObjectID;

module.exports = async (id) => {
    try {
        const testCollection = await mongoCollection("test-results");
        const { deletedCount } = await testCollection.deleteOne({ _id: ObjectId(id) });
        return { data: { deletedCount: deletedCount } };
    } catch (error) {
        logger.error(`failed to delete test result: ${error.message}`);
        return { error: error };
    }
};
