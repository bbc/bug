"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (req) => {
    const config = await configGet();
    const deviceId = req.query?.deviceId;

    if (!config) {
        return false;
    }

    if (!config.devices[deviceId]) {
        return false;
    }

    console.log(req.get("X-Forwarded-For"));
    const deviceAddress = req.ip.split(":")[3];
    const configAddress = config?.devices[req.params?.deviceId]?.address;

    console.log(deviceAddress);

    if (configAddress !== deviceAddress) {
        config.devices[deviceId].address = deviceAddress;
        console.log(`device-address-check: ${req.params?.deviceId} address was updated to ${deviceAddress}`);
        return await configPutViaCore(config);
    }

    return true;
};
