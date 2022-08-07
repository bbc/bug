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

        const devicesCollection = await mongoCollection("devices");
        const device = await devicesCollection.findOne({ deviceId: deviceId });

        const history = device.history.filter((item) => {
            if (item?.timestamp >= startTime && item?.timestamp <= endTime) {
                return item;
            }
        });

        let dataPoints = {
            timestamp: [],
            videoBitrate: [],
            audioBitrate: [],
            memory: [],
            cpu: [],
            temperature: [],
        };

        if (history.length > 0) {
            for (let item of history) {
                for (let key in item) {
                    try {
                        dataPoints[key].push(item[key]);
                    } catch {
                        console.log(`device-history: ${key} not found in ${deviceId}`);
                    }
                }
            }
        }

        return dataPoints;
    } catch (error) {
        console.log(`device-history: ${error.stack || error.trace || error || error.message}`);
    }
};
