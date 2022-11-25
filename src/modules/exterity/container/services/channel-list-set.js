"use strict";

const configGet = require("@core/config-get");
const exterity = require("@utils/exterity");
const getChannelListUrl = require("@utils/getChannelListUrl");

module.exports = async (deviceId) => {
    const config = await configGet();
    let status = false;
    if (config.devices[deviceId]) {
        const channelListingUrl = await getChannelListUrl(deviceId);
        status = await exterity(deviceId, {
            params: {
                SAPListener: "off",
                SSM_Uri: false,
                group_switch: "all",
                rStaticChannels: "on",
                staticChannels: "off",
                xmlChannelListRefresh: "1",
                xmlChannelListUrl: channelListingUrl,
            },
        });
    }
    return status;
};
