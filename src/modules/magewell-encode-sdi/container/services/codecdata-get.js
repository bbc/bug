"use strict";

const mongoSingle = require("@core/mongo-single");
const deepMerge = require("@utils/deep-merge");

module.exports = async () => {
    const codecData = (await mongoSingle.get("settings")) || {};
    const codecStatus = (await mongoSingle.get("status")) || {};

    if (!codecData["sub-stream"] || typeof codecData["sub-stream"] !== "object") {
        codecData["sub-stream"] = {};
    }

    codecData["sub-stream"]["_originalSubStreamEnabledState"] = codecData["sub-stream"]?.enable;

    try {

        // now add custom _isActive property to each stream
        const streamIndexes = [
            { name: "main-stream", index: 0 },
            { name: "sub-stream", index: 1 },
        ];
        for (let eachStream of streamIndexes) {
            const matchingStreams = codecStatus["live-status"].live.filter((stream) =>
                stream?.["stream-index"] === eachStream.index
            );
            codecData[eachStream.name]._isActive = (matchingStreams.length > 0);
        }

    } catch (error) {
        return codecData;
    }

    const localData = (await mongoSingle.get(`localdata`)) || {};

    return deepMerge(codecData, localData);
};