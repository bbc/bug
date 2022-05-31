"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (startTime = null, endTime = null) => {
    try {
        if (endTime === null) {
            endTime = Date.now();
        }

        if (startTime === null) {
            startTime = endTime - 60 * 5 * 1000; // 5 mins
        }

        const receiverCollection = await mongoCollection("receiver");

        let history = await receiverCollection
            .find({ timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) } })
            .toArray();

        history.map((item) => {
            return {
                timestamp: new Date(item.timestamp).getTime(),
                power: item?.power,
            };
        });

        return history;
    } catch (error) {
        console.log(`receiver-power-history: ${error.stack || error.trace || error || error.message}`);
    }
};
