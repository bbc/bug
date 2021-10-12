"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (sid) => {
    try {
        const devicesCollection = await mongoCollection("devices");
        const device = await devicesCollection.findOne({ sid: sid });

        if (!device) {
            return {
                error: "Could not retrieve device",
                status: "error",
                data: device,
            };
        }
        return { status: "success", data: device };
    } catch (error) {
        return null;
    }
};
