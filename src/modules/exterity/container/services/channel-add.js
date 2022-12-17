"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const { v4: uuidv4 } = require("uuid");

module.exports = async (channel) => {
    const config = await configGet();

    if (!config) {
        return false;
    }

    if (channel && channel.address) {
        const channelId = await uuidv4();
        config.channels[channelId] = channel;
    }

    return await configPutViaCore(config);
};
