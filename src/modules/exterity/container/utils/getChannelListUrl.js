const configGet = require("@core/config-get");
const bugHost = process.env.BUG_HOST || "127.0.0.1";

module.exports = async (deviceId) => {
    const config = await configGet();
    const channelListingUrl = `http://${bugHost}/container/${config?.id}/channel-list/?xmlChannelListUrl=${deviceId}.xml`;
    return channelListingUrl;
};
