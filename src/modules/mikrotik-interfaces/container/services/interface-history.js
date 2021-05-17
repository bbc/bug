'use strict';

const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceName, startTime = null, endTime = null) => {
    try {
        if (endTime === null) {
            endTime = Date.now();
        }

        if (startTime === null) {
            startTime = endTime - (60 * 5 * 1000); // 5 mins
        }

        const historyCollection = await mongoCollection("history");

        let history = await historyCollection.find({ timestamp: { $gte: startTime, $lte: endTime } }).toArray();

        let dataPoints = [];

        for(let eachItem of history) {
            if(eachItem['interfaces'][interfaceName]) {
                let dataPoint = eachItem['interfaces'][interfaceName];
                dataPoint.timestamp = eachItem.timestamp;
                dataPoints.push(dataPoint);
            }
        }
        return dataPoints;

    } catch (error) {
        console.log(`interface-history: ${error.stack || error.trace || error || error.message}`);
    }
};
