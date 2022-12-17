"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (channelId) => {
    let config = await configGet();
    const channelsCollection = await mongoCollection("channels");

    if (!config) {
        return false;
    }

    if (!config.channels[channelId]) {
        return false;
    }

    delete config.channels[channelId];
    channelsCollection.deleteOne({ channelId: channelId });

    return await configPutViaCore(config);
};
