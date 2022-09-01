"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");
const peerIsConnected = require("@services/peer-isconnected");

module.exports = async () => {
    const config = await configGet();
    const statusItems = [];

    const isAnyPeerConnected = await peerIsConnected();
    if (isAnyPeerConnected) {
        if (config) {
            const peerStats = await mongoSingle.get("peerStats");
            if (peerStats) {
                if (config.loss > 0) {
                    // check packet loss
                    if (peerStats?.frameLossRateAvg > config.loss) {
                        statusItems.push(
                            new StatusItem({
                                key: `frameLossRateAvg`,
                                message: [`Device has ${peerStats?.frameLossRateAvg}% packet loss`],
                                type: "warning",
                            })
                        );
                    }
                }

                if (config.delay > 0) {
                    // check delay
                    if (peerStats?.delayOut > config.delay) {
                        statusItems.push(
                            new StatusItem({
                                key: `delayOut`,
                                message: [`Device has delay of ${peerStats?.delayOut} ms`],
                                type: "warning",
                            })
                        );
                    }
                }
                if (config.jitter > 0) {
                    // check delay
                    if (peerStats?.packetJitter > config.jitter) {
                        statusItems.push(
                            new StatusItem({
                                key: `packetJitter`,
                                message: [`Device has jitter of ${peerStats?.packetJitter} ms`],
                                type: "warning",
                            })
                        );
                    }
                }
            }
        }
    }
    return statusItems;
};
