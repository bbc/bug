"use strict";

const configGet = require("@core/config-get");

module.exports = async (deviceId) => {
    try {
        const config = await configGet();
        const device = config?.devices[deviceId];
        const channels = config?.channels;
        const channelList = "";

        return channelList;
    } catch (error) {
        console.log(`channel-list-get: ${error.stack || error.trace || error || error.message}`);
    }
};
