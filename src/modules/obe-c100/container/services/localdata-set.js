"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (newLocalData, arrayName = null, index = null) => {
    // fetch the existing data
    let existingData = await mongoSingle.get("localdata");
    if (!existingData) {
        existingData = {};
    }
    if (arrayName !== null && index !== null) {
        // we're updating an array item
        if (!existingData?.[arrayName]) {
            // we don't have a localdata version of this - let's copy it across
            let codecData = await mongoSingle.get("codecdata");
            existingData[arrayName] = codecData[arrayName];
        }
        if (!existingData[arrayName]?.[index]) {
            // it doesn't exist in codecdata - this is weird
            return false;
        }
        // overwrite the codecdata with the new value
        existingData[arrayName][index] = Object.assign(existingData[arrayName][index], newLocalData);
    } else {
        // just update the main array
        existingData = Object.assign(existingData, newLocalData);
    }
    // save and return
    return await mongoSingle.set("localdata", existingData);
};
