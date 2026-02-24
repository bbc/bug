'use strict';

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (interfaceName, startTime = null, endTime = null) => {
    try {
        if (endTime === null) {
            endTime = Date.now();
        }

        if (startTime === null) {
            startTime = endTime - (60 * 5 * 1000); // 5 mins
        }

        const historyCollection = await mongoCollection("history");

        let history = await historyCollection.find({ timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) } }).toArray();

        let dataPoints = [];

        for (let eachItem of history) {
            if (eachItem['interfaces'][interfaceName]) {
                let dataPoint = eachItem['interfaces'][interfaceName];
                dataPoint.timestamp = new Date(eachItem.timestamp).getTime();
                dataPoints.push(dataPoint);
            }
        }
        return dataPoints;

    } catch (error) {
        logger.error(`interface-history: ${error.stack || error || error.message}`);
    }
};
