"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (groupId) => {
    try {
        if (!groupId || typeof groupId !== "string") {
            throw new Error("invalid groupId");
        }

        // and now the stats (what we actually want!)
        const statisticsCollection = await mongoCollection("statistics");
        const stats = await statisticsCollection.findOne({ type: "group", groupId });

        if (stats) {
            stats["_time"] = "";
            if (stats["seconds"]) {
                stats["_time"] = new Date(stats["seconds"] * 1000).toISOString().substring(11, 19);
            }
        }

        return stats;
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};