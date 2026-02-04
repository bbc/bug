"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, startTime = null, endTime = null) => {
    try {
        if (!interfaceId) throw new Error("invalid input: missing interfaceId");

        if (endTime === null) {
            endTime = Date.now();
        }

        if (startTime === null) {
            startTime = endTime - 5 * 60 * 1000; // 5 mins
        }

        const historyCollection = await mongoCollection("history");

        let history = await historyCollection
            .find({ timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) } })
            .toArray();

        let dataPoints = [];

        for (let eachItem of history) {
            if (eachItem["interfaces"] && eachItem["interfaces"][interfaceId]) {
                let dataPoint = { ...eachItem["interfaces"][interfaceId] };
                dataPoint.timestamp = new Date(eachItem.timestamp).getTime();
                dataPoints.push(dataPoint);
            }
        }

        if (!dataPoints.length) throw new Error("failed to load config");

        return dataPoints;
    } catch (err) {
        err.message = `interface-history: ${err.stack || err.message || err}`;
        throw err;
    }
};
