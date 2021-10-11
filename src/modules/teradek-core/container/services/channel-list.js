"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const channelsCollection = await mongoCollection("channels");
        const channels = await channelsCollection.find().toArray();

        const filteredList = [];

        if (channels) {
            for (const eachChannel of channels) {
                filteredList.push({
                    "id": eachChannel.id,
                    "label": eachChannel.title
                });
            }
        }

        return filteredList;

    } catch (error) {
        return null;
    }
};
