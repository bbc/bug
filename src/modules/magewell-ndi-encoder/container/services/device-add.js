"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const { v4: uuidv4 } = require("uuid");

module.exports = async (device) => {
    const config = await configGet();

    if (!config) {
        return false;
    }

    if (device.address && device.username && device.password) {
        const deviceId = await uuidv4();
        config.devices[deviceId] = { address: device.address, username: device.username, password: device.password };
    }

    return await configPutViaCore(config);
};
