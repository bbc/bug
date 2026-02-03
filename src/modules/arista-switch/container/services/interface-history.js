"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, startTime = null, endTime = null) => {
    try {
        const now = Date.now();
        endTime = endTime ?? now;
        startTime = startTime ?? (endTime - 5 * 60 * 1000);

        const historyCollection = await mongoCollection("history");

        const history = await historyCollection
            .find({
                timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) },
            })
            .toArray();

        // filter and map relevant interface entries
        const dataPoints = history
            .map(item => {
                const ifaceData = item.interfaces?.[interfaceId];
                if (!ifaceData) return null;
                return { ...ifaceData, timestamp: new Date(item.timestamp).getTime() };
            })
            .filter(Boolean);

        return dataPoints;

    } catch (err) {
        err.message = `interface-history(${interfaceId}): ${err.message}`;
        throw err;
    }
};
