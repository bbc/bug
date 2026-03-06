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

const buildStats = (eachData) => ({
    connectionId: eachData?._attributes?.["cxn-id"],
    connectionHandle: eachData?._attributes?.["cxn-handle"],
    groupId: eachData?._attributes?.["group-id"],
    type: "connection",
    "stats-total": parseStats(eachData?.["total-stats"]),
    "stats-10m": parseStats(eachData?.["ten-minutes-stats"]),
    "stats-1m": parseStats(eachData?.["minute-stats"]),
    timestamp: new Date(),
});

module.exports = async ({ event, statisticsCollection }) => {
    if (!event?.["cxn-stats"]) return false;

    const dataArray = ensureArray(event["cxn-stats"]);

    const bulkOps = dataArray.map((eachData) => ({
        updateOne: {
            filter: { id: eachData?._attributes?.["cxn-id"] },
            update: { $set: buildStats(eachData) },
            upsert: true,
        },
    }));

    if (bulkOps.length > 0) {
        logger.debug(`saving ${bulkOps.length} connection stats to DB`);
        await statisticsCollection.bulkWrite(bulkOps);
    }

    return true;
};