"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const { v4: uuidv4 } = require("uuid");

module.exports = async (device) => {
    const config = await configGet();

    if (!config) {
        return false;
    }

    if (device && device.address) {
        const deviceId = await uuidv4();
        config.devices[deviceId] = device;
        console.log(config);
    }

    return await configPutViaCore(config);
};
