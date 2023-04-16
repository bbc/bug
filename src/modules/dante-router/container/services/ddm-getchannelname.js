"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async (channelId) => {
    let config;

    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`ddm-getchannelname: failed to fetch config`);
        return false;
    }

    const domainsCollection = await mongoCollection("domains");
    const domain = await domainsCollection.findOne({ name: config.domain[0] });

    const channel = channelId.split(":");
    let deviceName;
    let channelName;
    let deviceId;
    let channelType;
    let channelIndex;

    if (channel[1] === "0") {
        deviceId = `${channel[0]}:${channel[1]}`;
        channelType = channel[2];
        channelIndex = channel[3];
    } else {
        deviceId = channel[0];
        channelType = channel[1];
        channelIndex = channel[2];
    }

    for (let device of domain.devices) {
        if (deviceId === device.id) {
            deviceName = device.name;
            for (let channel of device[`${channelType}s`]) {
                if (parseInt(channelIndex) === channel.index) {
                    channelName = channel.name;
                    break;
                }
            }
            break;
        }
    }

    return [deviceName, channelName];
};
