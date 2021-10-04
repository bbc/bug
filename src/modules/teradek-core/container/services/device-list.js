"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const devicesCollection = await mongoCollection("devices");
        const devices = await devicesCollection.find().toArray();

        if (!devices) {
            return {
                error: "Could not retieve devices",
                status: "error",
                data: devices,
            };
        }
        return { status: "success", data: devices };
    } catch (error) {
        return null;
    }
};
