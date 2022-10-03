"use strict";

const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");

module.exports = async (data) => {
    // get loaded program so we can show connections in the right order
    const loadedProgram = await mongoSingle.get("loadedProgram");

    // and now the stats (what we actually want!)
    const statisticsCollection = await mongoCollection("statistics");
    const statisticsFromDb = await statisticsCollection.find({ type: "group" }).toArray();

    const statisticsArray = [];
    for (const eachGroup of loadedProgram?.groups) {
        const groupStats = {
            id: eachGroup.id,
        };

        const fullStats = statisticsFromDb.find((s) => s.groupId === eachGroup.id);
        if (fullStats) {
            groupStats["jitter-buffer"] = fullStats["jitter-buffer"];
            groupStats["rx-bitrate"] = fullStats["rx-bitrate"];
            groupStats["tx-bitrate"] = fullStats["tx-bitrate"];
            groupStats["seconds"] = fullStats["seconds"];
            groupStats["_time"] = new Date(fullStats["seconds"] * 1000).toISOString().substring(11, 19);
        }
        statisticsArray.push(groupStats);
    }
    return statisticsArray;
};
