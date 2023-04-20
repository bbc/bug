"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (deviceName, channelName, channelType = "tx") => {
    const domainsCollection = await mongoCollection("domains");
    const domains = await domainsCollection.find().toArray();

    let deviceId;
    let channelIndex;
    let channelId = false;

    for (let domain of domains) {
        for (let device of domain.devices) {
            if (deviceName === device.name) {
                deviceId = device.id;
                for (let channel of device[`${channelType}Channels`]) {
                    if (channelName === channel.name) {
                        channelIndex = channel.index;
                    }
                }
            }
        }
    }

    if (deviceId && channelIndex) {
        channelId = `${deviceId}:${channelType}Channel:${channelIndex}`;
    } else if (deviceId) {
        channelId = `${deviceId}`;
    }

    return channelId;
};
