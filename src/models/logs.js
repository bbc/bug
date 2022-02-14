"use strict";

const logger = require("@utils/logger")(module);
const mongoCollection = require("@core/mongo-collection");

exports.get = async function (filter) {
    try {
        const logsCollection = await mongoCollection("logs");

        if (logsCollection) {
            const result = await logsCollection.find(filter).toArray();
            if (result) {
                return result;
            }
        }
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};
