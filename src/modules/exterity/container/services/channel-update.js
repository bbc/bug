"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (channelId, newChannel) => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.channels[channelId]) {
        return false;
    }

    config.channels[channelId] = { ...config.channels[channelId], ...newChannel };
    return await configPutViaCore(config);
};
