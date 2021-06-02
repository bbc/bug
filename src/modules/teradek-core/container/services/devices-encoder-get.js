"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (index) => {
    try {
        const devicesCollection = await mongoCollection("devices");
        const encoders = await devicesCollection
            .find({ type: "encoder" })
            .toArray();

        if (!encoders) {
            return {
                error: "Could not retieve encoders",
                status: "error",
                data: encoders,
            };
        }
        return { status: "success", data: encoders };
    } catch (error) {
        return null;
    }
};
