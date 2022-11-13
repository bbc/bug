"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const config = await configGet();
        const devicesCollection = await mongoCollection("devices");
        const devices = await devicesCollection.find().toArray();

        let mergedDevices = [];

        mergedDevices = devices.map((device) => {
            return {
                ...device,
                ...config.devices[device.deviceId],
                ...{ data: device.data.slice(device.data.length - 1 - 50, device.data.length - 1) },
            };
        });

        return await mergedDevices;
    } catch (error) {
        return [];
    }
};
