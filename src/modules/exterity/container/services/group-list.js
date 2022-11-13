"use strict";

const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const groups = [];
        const config = await configGet();

        for (let channelId in config.channels) {
            for (let group of config.channels[channelId].groups) {
                if (!groups.includes(group)) {
                    groups.push(group);
                }
            }
        }
        return group;
    } catch (error) {
        return [];
    }
};
