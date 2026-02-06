"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@utils/logger")(module);

module.exports = async (interfaceId, startTime = null, endTime = null) => {
    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        const now = Date.now();
        endTime = endTime ?? now;
        startTime = startTime ?? (endTime - 5 * 60 * 1000);

        if (!(startTime instanceof Date)) startTime = new Date(startTime);
        if (!(endTime instanceof Date)) endTime = new Date(endTime);

        const historyCollection = await mongoCollection("history");

        const history = await historyCollection
            .find({ timestamp: { $gte: startTime, $lte: endTime } })
            .toArray();

        const dataPoints = history
            .map(item => {
                const ifaceData = item.interfaces?.[interfaceId];
                if (!ifaceData) return null;

                return {
                    ...ifaceData,
                    timestamp: new Date(item.timestamp).getTime(),
                };
            })
            .filter(Boolean); // remove nulls

        return dataPoints;
    } catch (err) {
        err.message = `interface-history(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
