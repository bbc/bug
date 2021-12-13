"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (newLocalData) => {
    // fetch the existing data
    let existingData = await mongoSingle.get("localdata");
    if (!existingData) {
        existingData = {};
    }
    // merge and save
    return await mongoSingle.set("localdata", Object.assign(existingData, newLocalData));
};
