"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (deviceId) => {
    try {
        const devicesCollection = await mongoCollection("devices");
        const devices = await devicesCollection.find({}).toArray();
        return devices;
    } catch (error) {
        return [];
    }
};
