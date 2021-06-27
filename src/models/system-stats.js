"use strict";

const logger = require("@utils/logger")(module);
const mongoCollection = require("@core/mongo-collection");

exports.get = async function () {
    try {
        const systemCollection = await mongoCollection("system");
        const result = await systemCollection.find().toArray();
        return result;
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};
