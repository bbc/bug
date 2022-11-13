//172.24.40.26/cgi-bin/config.json.cgi?xmlChannelListUrl=http%3A%2F%2Fwww.ringmain.bcn.bbc.co.uk%2Fchannels%2Fexterity.xml1&callback=updatePageComplete

http: "use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const mongoCollection = require("@core/mongo-collection");
const exterity = require("@utils/exterity");

const bugHost = process.env.BUG_HOST || "127.0.0.1";

module.exports = async (deviceId) => {
    const config = await configGet();
    const status = false;
    if (config.devices[deviceId]) {
        const channelListingUrl = `http://${bugHost}/container/${panelId}/channel-list/?xmlChannelListUrl=${deviceId}.xml`;
        console.log(channelListingUrl);
        status = await exterity(
            deviceId,
            `cgi-bin/config.json.cgi?xmlChannelListUrl=${channelListingUrl}&callback=updatePageComplete`
        );
    }
    return status;
};
