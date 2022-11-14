"use strict";

const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const channels = [];
        const config = await configGet();

        for (let channelId in config?.channels) {
            channels.push({
                ...config?.channels[channelId],
                ...{ channelId: channelId },
                ...{
                    addressFull: `${config?.channels[channelId]?.protocol.toLowerCase()}://${
                        config?.channels[channelId]?.address
                    }:${config?.channels[channelId]?.port}`,
                },
            });
        }

        return channels;
    } catch (error) {
        return [];
    }
};
