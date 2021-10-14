"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (identifier) => {
    try {
        const channelsCollection = await mongoCollection("channels");
        return await channelsCollection.findOne({
            identifier: identifier,
        });

    } catch (error) {
        return null;
    }
};
