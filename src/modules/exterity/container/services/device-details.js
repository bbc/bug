"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async (deviceId) => {
    try {
        const config = await configGet();
        const devicesCollection = await mongoCollection("devices");
        const device = await devicesCollection.findOne({ deviceId: deviceId });

        return { ...device, ...config.devices[deviceId] };
    } catch (error) {
        return [];
    }
};
