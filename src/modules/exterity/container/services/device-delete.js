"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (deviceId) => {
    let config = await configGet();
    const devicesCollection = await mongoCollection("devices");

    if (!config) {
        return false;
    }

    if (!config.devices[deviceId]) {
        return false;
    }

    delete config.devices[deviceId];
    devicesCollection.deleteOne({ deviceId: deviceId });

    return await configPutViaCore(config);
};
