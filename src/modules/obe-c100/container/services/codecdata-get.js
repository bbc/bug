"use strict";

const mongoSingle = require("@core/mongo-single");
const deviceIdGet = require("@services/deviceid-get");

module.exports = async () => {
    // fetch hashed address of device to use as id
    const deviceId = await deviceIdGet();

    // fetch codec data
    let codecData = await mongoSingle.get("codecdata");

    // fetch local data
    let localData = await mongoSingle.get(`localdata_${deviceId}`);

    // merge arrays
    return localData ? Object.assign(codecData, localData) : codecData;
};
