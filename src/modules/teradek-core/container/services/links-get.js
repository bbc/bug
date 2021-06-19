"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const linksCollection = await mongoCollection("links");
        const links = await linksCollection.find().toArray();

        if (!links) {
            return {
                error: "Could not retieve links for the devices",
                status: "error",
                data: links,
            };
        }
        return { status: "success", data: links };
    } catch (error) {
        return null;
    }
};
