"use strict";

const ensureArray = require("@utils/ensure-array");
const logger = require("@core/logger")(module);

const parseZeroInt = (val) => (Number.isNaN(Number(val)) ? 0 : parseInt(val, 10));

const parseStats = (statsObj) => ({
    loss: parseZeroInt(statsObj?._attributes?.loss),
    empty: parseZeroInt(statsObj?._attributes?.empty),
    late: parseZeroInt(statsObj?._attributes?.late),
    fec: parseZeroInt(statsObj?._attributes?.fec),
});

const buildGroupStats = (eachData) => ({
    groupId: eachData?._attributes?.["group-id"],
    type: "group",
    "minute-aggregate": parseStats(eachData?.["minute-aggregate"]),
    "ten-minutes-aggregate": parseStats(eachData?.["ten-minutes-aggregate"]),
    "total-aggregate": parseStats(eachData?.["total-aggregate"]),
    seconds: eachData?.["seconds"]?._text,
    "tx-bitrate": eachData?.["tx-bitrate"]?._text,
    "rx-bitrate": eachData?.["rx-bitrate"]?._text,
    "jitter-buffer": eachData?.["jitter-buffer"]?._attributes,
    "rx-bytes": eachData?.["rx-bytes"]?._text,
    "tx-bytes": eachData?.["tx-bytes"]?._text,
    timestamp: new Date(),
});

module.exports = async ({ event, statisticsCollection }) => {
    const groupStatsArray = ensureArray(event?.["grp-stats"]);
    if (!groupStatsArray.length) return false;

    const bulkOps = groupStatsArray.map((eachData) => ({
        updateOne: {
            filter: { id: eachData?._attributes?.["group-id"] },
            update: { $set: buildGroupStats(eachData) },
            upsert: true,
        },
    }));

    if (bulkOps.length > 0) {
        logger.debug(`saving ${bulkOps.length} group stats to DB`);
        await statisticsCollection.bulkWrite(bulkOps);
    }

    return true;
};