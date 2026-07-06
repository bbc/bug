"use strict";

const mongoSingle = require("@core/mongo-single");
const deviceIdGet = require("@services/deviceid-get");

module.exports = async () => {
    let deviceId;
    try {
        deviceId = await deviceIdGet();
    } catch (error) {
        return false;
    }

    const localData = await mongoSingle.get(`localdata_${deviceId}`);

    return !!(localData && Object.keys(localData).length > 0);
};