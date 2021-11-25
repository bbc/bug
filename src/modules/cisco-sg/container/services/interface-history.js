"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, startTime = null, endTime = null) => {
    try {
        if (endTime === null) {
            endTime = Date.now();
        }

        if (startTime === null) {
            startTime = endTime - 60 * 5 * 1000; // 5 mins
        }
        const historyCollection = await mongoCollection("history");

        let history = await historyCollection
            .find({ timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) } })
            .toArray();

        let dataPoints = [];

        for (let eachItem of history) {
            if (eachItem["interfaces"][interfaceId]) {
                let dataPoint = eachItem["interfaces"][interfaceId];
                dataPoint.timestamp = new Date(eachItem.timestamp).getTime();
                dataPoints.push(dataPoint);
            }
        }
        return dataPoints;
    } catch (error) {
        console.log(`interface-history: ${error.stack || error.trace || error || error.message}`);
    }
};
