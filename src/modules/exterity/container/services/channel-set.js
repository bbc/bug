"use strict";

const configGet = require("@core/config-get");
const exterity = require("@utils/exterity");

module.exports = async (deviceId, channelId) => {
    const config = await configGet();
    const channel = config?.channels[channelId];

    const fullAddress = `${channel?.protocol.toLowerCase()}://${channel?.address}:${channel?.port}`;

    const status = await exterity(deviceId, {
        params: {
            currentChannel: fullAddress,
        },
        action: "apply_playback",
    });

    return status;
};
