"use strict";

const mongoSingle = require("@core/mongo-single");
const deviceIdGet = require("@services/deviceid-get");

module.exports = async () => {
    const deviceId = await deviceIdGet();
    return await mongoSingle.set(`localdata_${deviceId}`, {});
};