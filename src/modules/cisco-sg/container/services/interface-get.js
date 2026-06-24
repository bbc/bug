"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId) => {
    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        const dbInterfaces = await mongoCollection("interfaces");
        const interfaceResult = await dbInterfaces.findOne({ interfaceId: Number(interfaceId) });

        if (!interfaceResult) {
            throw new Error(`interface ${interfaceId} not found`);
        }

        return interfaceResult;
    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
