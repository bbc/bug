"use strict";

const logger = require("@utils/logger")(module);
const mongoCollection = require("@core/mongo-collection");

exports.get = async function (level) {
    try {
        const logsCollection = await mongoCollection("logs");
        const result = await logsCollection.find({level:level}).toArray();
        return result
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};