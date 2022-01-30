"use strict";

const mongoSingle = require("@core/mongo-single");
const deviceIdGet = require("@services/deviceid-get");

module.exports = async (newLocalData) => {
    // fetch hashed address of device to use as id
    const deviceId = await deviceIdGet();

    // fetch the existing data
    let existingData = await mongoSingle.get(`localdata_${deviceId}`);
    if (!existingData) {
        existingData = {};
    }
    // merge and save
    return await mongoSingle.set(`localdata_${deviceId}`, Object.assign(existingData, newLocalData));
};
