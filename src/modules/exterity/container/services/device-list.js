"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const config = await configGet();
        const devicesCollection = await mongoCollection("devices");
        const devices = await devicesCollection.find().toArray();

        let mergedDevices = [];

        mergedDevices = await devices.map((device) => {
            delete device._id;
            delete config.devices[device.deviceId].password;
            return {
                ...device,
                ...config.devices[device.deviceId],
            };
        });

        return mergedDevices;
    } catch (error) {
        return [];
    }
};
