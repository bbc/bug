"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (deviceId) => {
    try {
        const devicesCollection = await mongoCollection("devices");
        const device = await devicesCollection.findOne({ deviceId: deviceId });
        return device;
    } catch (error) {
        return undefined;
    }
};
