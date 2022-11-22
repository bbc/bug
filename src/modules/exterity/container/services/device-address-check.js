"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (req) => {
    const config = await configGet();
    console.log(req);

    if (!config) {
        return false;
    }

    if (!config.devices[deviceId]) {
        return false;
    }

    const deviceAddress = req.address;
    const configAddress = config?.devices[req.params?.deviceId]?.address;

    if (configAddress !== deviceAddress) {
        config.devices[deviceId]?.address = deviceAddress;
        return await configPutViaCore(config);
    }

    return true;
};
