"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@utils/logger")(module);

module.exports = async (interfaceId) => {
    try {
        const interfaces = await mongoCollection("interfaces");
        return interfaces.findOne({ interfaceId });
    } catch (err) {
        err.message = `interface-get(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
