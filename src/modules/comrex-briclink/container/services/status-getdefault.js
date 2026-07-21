"use strict";

const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");
const peerIsConnected = require("@services/peer-isconnected");

module.exports = async () => {
    try {
        const peerList = await mongoSingle.get("peerList");
        const peerStats = await mongoSingle.get("peerStats");
        const sysOptions = await mongoSingle.get("sysOptions");
        const isConnected = await peerIsConnected();

        const peerCount = Array.isArray(peerList) ? peerList.length : 0;
        const unitName = sysOptions?.unit_name;

        let message;
        if (isConnected && peerStats?.name) {
            message = `Connected to '${peerStats.name}'`;
        } else if (isConnected) {
            message = "Connected";
        } else {
            message = `Not connected, ${peerCount} peer(s) available`;
        }

        if (unitName) {
            message = `${unitName} ${message.charAt(0).toLowerCase()}${message.slice(1)}`;
        }

        return new StatusItem({
            message: message,
            key: "defaultservice",
            type: isConnected ? "success" : "default",
            flags: [],
        });
    } catch (err) {
        logger.error(err.stack || err.message);
        return [];
    }
};
