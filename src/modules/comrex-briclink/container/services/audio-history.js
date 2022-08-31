"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const historyCollection = await mongoCollection("history");
    const stats = await historyCollection.findOne({ name: "levels" });
    if (!stats?.data) {
        return [];
    }

    // limit the array to a maximum age
    const oldestTimestamp = Date.now() - 120 * 1000;
    stats.data = stats.data.filter((stat) => stat.timestamp > oldestTimestamp);

    return stats.data;
};
