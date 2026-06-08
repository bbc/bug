"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    try {
        const dbInterfaces = await mongoCollection("interfaces");
        let interfaces = await dbInterfaces.find().toArray();
        if (!interfaces) {
            return [];
        }

        return interfaces;
    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
