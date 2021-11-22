"use strict";

const mongoCollection = require("@core/mongo-collection");
const e = require("express");

module.exports = async (startTime = null, endTime = null) => {
    try {
        if (endTime === null) {
            endTime = Date.now();
        }

        if (startTime === null) {
            startTime = endTime - 60 * 5 * 1000; // 5 mins
        }

        const deviceCollection = await mongoCollection("data");

        let history = await deviceCollection
            .find({ timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) } })
            .toArray();

        let dataPoints = {
            videoJitter: [],
            audioJitter: [],
            memory: [],
            cpu: [],
            temperature: [],
        };

        for (let eachItem of history) {
            dataPoints.videoJitter.push({ timestamp: eachItem.timestamp, value: eachItem.ndi["video-jitter"] });
            dataPoints.audioJitter.push({ timestamp: eachItem.timestamp, value: eachItem.ndi["audio-jitter"] });
            dataPoints.cpu.push({ timestamp: eachItem.timestamp, value: eachItem.device["cpu-usage"] });
            dataPoints.memory.push({ timestamp: eachItem.timestamp, value: eachItem.device["memory-usage"] });
            dataPoints.temperature.push({ timestamp: eachItem.timestamp, value: eachItem.device["core-temp"] });
        }

        return dataPoints;
    } catch (error) {
        console.log(`device-history: ${error.stack || error.trace || error || error.message}`);
    }
};
