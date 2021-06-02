"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (index) => {
    try {
        const devicesCollection = await mongoCollection("devices");
        const decoders = await devicesCollection
            .find({ type: "decoder" })
            .toArray();

        if (!decoders) {
            return {
                error: "Could not retieve decoders",
                status: "error",
                data: decoders,
            };
        }
        return { status: "success", data: decoders };
    } catch (error) {
        return null;
    }
};
