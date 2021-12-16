"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    // fetch codec data
    let codecData = await mongoSingle.get("codecdata");

    // fetch local data
    let localData = await mongoSingle.get("localdata");
    if (!localData) {
        localData = {};
    }

    if (!localData.outputs) {
        localData.outputs = codecData.outputs;
    }

    localData.outputs.push({
        outputMethod: 2,
        outputIP: "127.0.0.1",
        outputPort: 6000,
        outputTTL: 50,
        outputTOS: 26,
        outputFecType: 1,
        outputFecColumns: 0,
        outputFecRows: 0,
        outputDupDelay: 0,
        outputARQBuffer: 1,
    });

    // save and return
    return await mongoSingle.set("localdata", localData);
};
