"use strict";

const configGet = require("@core/config-get");
const convert = require("xml-js");

const options = { compact: true, ignoreComment: true, spaces: 4 };

const commonElements = (arr1, arr2) => {
    try {
        return arr1.some((item) => arr2.includes(item));
    } catch (err) {
        return false;
    }
};

const parseChannels = async (channels) => {
    const parsedChannels = {
        setup: {
            _attributes: {
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            },
            "channel-list": {
                channel: [],
            },
        },
    };

    for (let channel of channels) {
        parsedChannels.setup["channel-list"].channel.push({
            _attributes: {
                number: channel?.number,
            },
            multicast: {
                _attributes: {
                    ip: channel.address,
                    port: channel.port,
                },
            },
            dvb: {
                _attributes: {
                    sid: "1",
                },
            },
            name: {
                _text: channel?.title,
            },
        });
    }

    return parsedChannels;
};

module.exports = async (deviceIdXml) => {
    try {
        const deviceId = deviceIdXml.split(".")[0];
        const config = await configGet();
        const device = config?.devices[deviceId];
        const channels = config?.channels;
        const channelList = [];

        for (let channelId in channels) {
            if (commonElements(channels[channelId]?.groups, device?.groups)) {
                channelList.push(channels[channelId]);
            }
        }

        const parsedChannels = await parseChannels(channelList);

        //Final conversion to XML
        const xml = await convert.json2xml(parsedChannels, options);
        return xml;
    } catch (error) {
        console.log(`channel-list-get: ${error.stack || error.trace || error || error.message}`);
    }
};
