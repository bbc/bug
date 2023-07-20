"use strict";

const mongoCollection = require("@core/mongo-collection");
const ensureArray = require("@utils/ensure-array");
const mongoCreateIndex = require("@core/mongo-createindex");

const parseZeroInt = (val) => {
    if (isNaN(val)) {
        return 0;
    }
    return parseInt(val);
};

module.exports = async (data) => {
    if (data?.["cxn-stats"]) {
        const statisticsCollection = await mongoCollection("statistics");
        // and now create the index with ttl
        await mongoCreateIndex(statisticsCollection, "timestamp", { expireAfterSeconds: 30 });

        const dataArray = ensureArray(data?.["cxn-stats"]);

        for (const eachData of dataArray) {
            const connectionId = eachData["_attributes"]["cxn-id"];
            const connectionHandle = eachData["_attributes"]["cxn-handle"];
            const groupId = eachData["_attributes"]["group-id"];

            // then form the data to update db
            const statsArray = {
                connectionId: connectionId,
                connectionHandle: connectionHandle,
                groupId: groupId,
                type: "connection",
                "stats-total": {
                    loss: parseZeroInt(eachData["total-stats"]["_attributes"]["loss"]),
                    empty: parseZeroInt(eachData["total-stats"]["_attributes"]["empty"]),
                    late: parseZeroInt(eachData["total-stats"]["_attributes"]["late"]),
                    fec: parseZeroInt(eachData["total-stats"]["_attributes"]["fec"]),
                },
                "stats-10m": {
                    loss: parseZeroInt(eachData["ten-minutes-stats"]["_attributes"]["loss"]),
                    empty: parseZeroInt(eachData["ten-minutes-stats"]["_attributes"]["empty"]),
                    late: parseZeroInt(eachData["ten-minutes-stats"]["_attributes"]["late"]),
                    fec: parseZeroInt(eachData["ten-minutes-stats"]["_attributes"]["fec"]),
                },
                "stats-1m": {
                    loss: parseZeroInt(eachData["minute-stats"]["_attributes"]["loss"]),
                    empty: parseZeroInt(eachData["minute-stats"]["_attributes"]["empty"]),
                    late: parseZeroInt(eachData["minute-stats"]["_attributes"]["late"]),
                    fec: parseZeroInt(eachData["minute-stats"]["_attributes"]["fec"]),
                },
                timestamp: new Date(),
            };

            await statisticsCollection.updateOne({ id: connectionId }, { $set: statsArray }, { upsert: true });
        }

        return true;
    }
    return false;
};
