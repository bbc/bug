"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    // fetch codec data
    let codecData = await mongoSingle.get("codecdata");

    // fetch local data
    let localData = await mongoSingle.get("localdata");

    // merge arrays
    let mergedData = Object.assign(codecData, localData);

    return mergedData;
};
