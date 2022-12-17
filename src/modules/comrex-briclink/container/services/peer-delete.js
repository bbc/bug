"use strict";

const comrexSocket = require("@utils/comrex-socket");
const configGet = require("@core/config-get");
const mongoSingle = require("@core/mongo-single");

module.exports = async (peerId) => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    try {
        const device = new comrexSocket({
            host: config.address,
            port: config.port,
            username: config.username,
            password: config.password,
        });
        await device.connect();
        const cmd = `<removePeer id="${peerId}" />`;
        console.log(`peer-delete: sending '${cmd}'`);
        device.send(cmd);
        setTimeout(() => {
            device.disconnect();
        }, 1000);

        // now we can assume it's worked, we should update the db
        const peerList = await mongoSingle.get("peerList");
        const filteredPeerList = peerList.filter((peer) => peer.id !== parseInt(peerId));
        await mongoSingle.set("peerList", filteredPeerList, 60);
        return true;
    } catch (error) {
        return false;
    }
};
