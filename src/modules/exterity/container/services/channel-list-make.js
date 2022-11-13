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

const readXML = async (filePath) => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return await convert.xml2json(data, { compact: true, spaces: 4 });
    } catch (err) {
        console.error(err);
    }
};

const writeXml = async (filePath, data) => {
    try {
        const options = { compact: true, ignoreComment: true, spaces: 4 };
        const xml = convert.json2xml(data, options);
        fs.writeFileSync(filePath, xml);
        // file written successfully
    } catch (err) {
        console.error(err);
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
        if (output.protocol === "RTP" || output.protocol === "UDP") {
            parsedChannels.setup["channel-list"].channel.push({
                _attributes: {
                    number: channel?.number,
                },
                multicast: {
                    _attributes: {
                        ip: channel.address,
                        port: output.port,
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
    }

    return parsedChannels;
};

module.exports = async (deviceId) => {
    try {
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
        console.log(parseChannels);

        //Final conversion to XML
        const xml = await convert.json2xml(data, options);

        return xml;
    } catch (error) {
        console.log(`channel-list-get: ${error.stack || error.trace || error || error.message}`);
    }
};
