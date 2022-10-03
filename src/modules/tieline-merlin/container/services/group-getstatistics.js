"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (groupId) => {
    // and now the stats (what we actually want!)
    const statisticsCollection = await mongoCollection("statistics");
    const stats = await statisticsCollection.findOne({ type: "group", groupId: groupId });
    stats["_time"] = "";
    if (stats["seconds"]) {
        stats["_time"] = new Date(stats["seconds"] * 1000).toISOString().substring(11, 19);
    }
    return stats;
};
