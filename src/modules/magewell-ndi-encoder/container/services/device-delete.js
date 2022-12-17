"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (deviceId) => {
    const config = await configGet();
    const devicesCollection = await mongoCollection("devices");

    if (!config) {
        return false;
    }

    if (config.devices[deviceId]) {
        delete config.devices[deviceId];
        await devicesCollection.deleteOne({ deviceId: deviceId });
    }

    return await configPutViaCore(config);
};
