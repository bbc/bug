"use strict";

const mongoCollection = require("@core/mongo-collection");
const e = require("express");

module.exports = async (deviceId, startTime = null, endTime = null) => {
    try {
        if (endTime === null) {
            endTime = Date.now();
        }

        if (startTime === null) {
            startTime = endTime - 60 * 5 * 1000; // 5 mins
        }

        const networkCollection = await mongoCollection("network");
        const device = await networkCollection.findOne({ deviceId: deviceId });

        let history = device.history.filter((item) => {
            if (item?.timestamp >= startTime && item?.timestamp <= endTime) {
                return item;
            }
        });

        history.map((item) => {
            item.timestamp = new Date(item.timestamp).getTime();
            return item;
        });

        return history;
    } catch (error) {
        console.log(`network-history: ${error.stack || error.trace || error || error.message}`);
    }
};
