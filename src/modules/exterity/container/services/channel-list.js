"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const config = await configGet();
        const channelsCollection = await mongoCollection("channels");
        const channels = await channelsCollection.find().toArray();

        let mergedChannels = [];

        mergedChannels = channels.map((channel) => {
            return {
                ...channel,
                ...config.channels[channel.channelId],
                ...{ data: channel.data.slice(channel.data.length - 1 - 50, channel.data.length - 1) },
            };
        });

        return await mergedChannels;
    } catch (error) {
        return [];
    }
};
