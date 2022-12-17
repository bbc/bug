"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (deviceId, device) => {
    const config = await configGet();

    if (config && config.devices[deviceId] && device.address && device.password && device.username) {
        config.devices[deviceId] = { address: device.address, username: device.username, password: device.password };
        return await configPutViaCore(config);
    }

    return false;
};
