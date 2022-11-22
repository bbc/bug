"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async (channelId) => {
    try {
        const config = await configGet();
        const channelsCollection = await mongoCollection("channels");
        const channel = await channelsCollection.findOne({ channelId: channelId });

        return { ...channel, ...config.channels[channelId] };
    } catch (error) {
        return [];
    }
};
