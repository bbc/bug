"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const devicesCollection = await mongoCollection("devices");
        const devices = await devicesCollection.find().toArray();
        const config = await configGet();

        const filteredEncoders = devices.filter((device) => config.encoders.includes(device.sid));
        const filterDecoders = devices.filter((device) => config.decoder.includes(device.sid));

        const filteredDevices = filteredEncoders.concat(filterDecoders);

        if (!filteredDevices) {
            return {
                error: "Could not retieve devices",
                status: "failed",
                data: filteredDevices,
            };
        }
        return { status: "success", data: filteredDevices };
    } catch (error) {
        return { status: "failed", error: error };
    }
};
