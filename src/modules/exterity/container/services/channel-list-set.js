"use strict";

const configGet = require("@core/config-get");
const exterity = require("@utils/exterity");
const getChannelListUrl = require("@utils/getChannelListUrl");

module.exports = async (deviceId) => {
    const config = await configGet();
    const status = false;
    if (config.devices[deviceId]) {
        const channelListingUrl = await getChannelListUrl(deviceId);
        status = await exterity(
            deviceId,
            `cgi-bin/config.json.cgi?xmlChannelListRefresh=1&xmlChannelListUrl=${channelListingUrl}&channelListType=xml&callback=updatePageComplete`
        );
    }
    return status;
};
