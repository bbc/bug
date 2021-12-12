"use strict";

const logger = require("@utils/logger")(module);
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const updatesCollection = await mongoCollection("updates");
        const updates = await updatesCollection.findOne();

        if (updates) {
            delete updates._id;
            return updates;
        }

        return {
            status: "error",
            checkTime: 0,
            message: "Check for updates",
        };
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve latest avalible BUG version.`);
    }
};
