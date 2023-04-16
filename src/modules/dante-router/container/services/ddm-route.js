"use strict";

const configGet = require("@core/config-get");
const ddm = require("@services/ddm-request");
const getChannelName = require("@services/ddm-getchannelname");

module.exports = async (receiverId, transmitterId) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`ddm-route: failed to fetch config`);
        return false;
    }

    try {
        const [transmitterDevice, transmitterChannel] = await getChannelName(transmitterId);

        const receiver = receiverId.split(":");
        let deviceId;
        let receiverIndex;

        if (receiver[1] === "0") {
            deviceId = `${receiver[0]}:${receiver[1]}`;
            receiverIndex = receiver[3];
        } else {
            deviceId = receiver[0];
            receiverIndex = receiver[2];
        }

        const response = await ddm.get(
            config.address,
            config.port,
            config.apiKey,
            ddm.query`mutation DeviceRxChannelsSubscriptionSet($DeviceRxChannelsSubscriptionSetInput: DeviceRxChannelsSubscriptionSetInput!) {
                DeviceRxChannelsSubscriptionSet(input: $DeviceRxChannelsSubscriptionSetInput) {
                  ok
                }
              }
            `,
            {
                DeviceRxChannelsSubscriptionSetInput: {
                    deviceId: deviceId,
                    subscriptions: [
                        {
                            rxChannelId: parseInt(receiverIndex),
                            rxChannelIndex: parseInt(receiverIndex),
                            subscribedDevice: transmitterDevice,
                            subscribedChannel: transmitterChannel,
                        },
                    ],
                },
            }
        );
        return true;
    } catch (error) {
        console.log("ddm-route: ", error);
        return false;
    }
};
