"use strict";

const mongoSingle = require("@core/mongo-single");
const updateBitrate = require("@services/update-bitrate");
const deviceIdGet = require("@services/deviceid-get");

module.exports = async (newLocalData, arrayName = null, index = null) => {
    // fetch hashed address of device to use as id
    const deviceId = await deviceIdGet();

    // fetch the existing data
    let existingData = await mongoSingle.get(`localdata_${deviceId}`);
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
    if (!(await mongoSingle.set(`localdata_${deviceId}`, existingData))) {
        return false;
    }

    if (newLocalData["videoBufferSize"] !== undefined) {
        return true;
    }

    return await updateBitrate();
};
