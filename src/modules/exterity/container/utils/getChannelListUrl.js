const configGet = require("@core/config-get");
const bugHost = process.env.BUG_HOST || "127.0.0.1";
const bugPort = process.env.BUG_PORT || "80";

module.exports = async (deviceId) => {
    const config = await configGet();
    const channelListingUrl = `http://${bugHost}:${bugPort}/container/${config?.id}/channel-list/?deviceId=${deviceId}`;
    return channelListingUrl;
};
