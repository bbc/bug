"use strict";

const mongoSingle = require("@core/mongo-single");
const deviceIdGet = require("@services/deviceid-get");

module.exports = async () => {
    // fetch hashed address of device to use as id
    const deviceId = await deviceIdGet();

    // fetch device data
    const deviceData = {
        video: await mongoSingle.get("video"),
        audio: await mongoSingle.get("audio"),
        system: await mongoSingle.get("system"),
        genlock: await mongoSingle.get("genlock"),
    };

    // fetch local data
    const localData = await mongoSingle.get(`localdata_${deviceId}`);

    // merge and return the two
    return Object.assign(deviceData, localData);
};
