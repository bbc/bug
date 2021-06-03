"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (identifier) => {
    try {
        const channelsCollection = await mongoCollection("channels");
        const channels = await channelsCollection.findOne({
            identifier: identifier,
        });

        if (!channels) {
            return {
                error: "Could not retieve channels",
                status: "error",
                data: channels,
            };
        }
        return { status: "success", data: channels };
    } catch (error) {
        return null;
    }
};
