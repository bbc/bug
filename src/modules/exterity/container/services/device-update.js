"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (deviceId, newDevice) => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.devices[deviceId]) {
        return false;
    }

    config.devices[deviceId] = { ...config.devices[deviceId], ...newDevice };
    return await configPutViaCore(config);
};
