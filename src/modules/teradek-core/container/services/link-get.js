"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (sid) => {
    try {
        const linksCollection = await mongoCollection("links");
        const link = await linksCollection.findOne({ encoderSid: sid });

        if (!link) {
            return {
                error: "Could not retieve links for device",
                status: "error",
                data: link,
            };
        }
        return { status: "success", data: link };
    } catch (error) {
        return null;
    }
};
