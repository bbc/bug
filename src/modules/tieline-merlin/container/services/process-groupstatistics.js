"use strict";

const mongoCollection = require("@core/mongo-collection");
const ensureArray = require("@utils/ensure-array");
const mongoCreateIndex = require("@core/mongo-createindex");

const parseZeroInt = (val) => {
    if (!isNaN(val)) {
        return 0;
    }
    return parseInt(0);
};

module.exports = async (data) => {
    if (data?.["grp-stats"]) {
        const statisticsCollection = await mongoCollection("statistics");

        const dataGroupStatsArray = ensureArray(data?.["grp-stats"]);

        for (const eachData of dataGroupStatsArray) {
            const groupId = eachData["_attributes"]["group-id"];

            // then form the data to update db
            const statsArray = {
                groupId: groupId,
                type: "group",
                "minute-aggregate": {
                    loss: parseZeroInt(eachData["minute-aggregate"]["_attributes"]["loss"]),
                    empty: parseZeroInt(eachData["minute-aggregate"]["_attributes"]["empty"]),
                    late: parseZeroInt(eachData["minute-aggregate"]["_attributes"]["late"]),
                    fec: parseZeroInt(eachData["minute-aggregate"]["_attributes"]["fec"]),
                },
                "ten-minutes-aggregate": {
                    loss: parseZeroInt(eachData["ten-minutes-aggregate"]["_attributes"]["loss"]),
                    empty: parseZeroInt(eachData["ten-minutes-aggregate"]["_attributes"]["empty"]),
                    late: parseZeroInt(eachData["ten-minutes-aggregate"]["_attributes"]["late"]),
                    fec: parseZeroInt(eachData["ten-minutes-aggregate"]["_attributes"]["fec"]),
                },
                seconds: eachData?.["seconds"]?.["_text"],
                "tx-bitrate": eachData?.["tx-bitrate"]?.["_text"],
                "total-aggregate": {
                    loss: parseZeroInt(eachData["total-aggregate"]["_attributes"]["loss"]),
                    empty: parseZeroInt(eachData["total-aggregate"]["_attributes"]["empty"]),
                    late: parseZeroInt(eachData["total-aggregate"]["_attributes"]["late"]),
                    fec: parseZeroInt(eachData["total-aggregate"]["_attributes"]["fec"]),
                },
                "rx-bitrate": eachData?.["rx-bitrate"]?.["_text"],
                "jitter-buffer": eachData?.["jitter-buffer"]?.["_attributes"],
                "rx-bytes": eachData?.["rx-bytes"]?.["_text"],
                "tx-bytes": eachData?.["tx-bytes"]?.["_text"],
                timestamp: new Date(),
            };
            await statisticsCollection.updateOne({ id: groupId }, { $set: statsArray }, { upsert: true });
        }

        return true;
    }
    return false;
};
