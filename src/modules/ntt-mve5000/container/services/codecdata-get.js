"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    // fetch codec data
    const codecData = await mongoSingle.get("codecdata");

    // fetch local data
    const localData = await mongoSingle.get("localdata");

    // merge and return the two
    return Object.assign(codecData, localData);
};