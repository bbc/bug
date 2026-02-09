"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const dbInterfaces = await mongoCollection("interfaces");
        const result = await dbInterfaces.distinct("device");
        if (result.length === 1 && result[0] === null) {
            return null;
        }
        return result;
    } catch (err) {
        err.message = `device-stackcount: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
