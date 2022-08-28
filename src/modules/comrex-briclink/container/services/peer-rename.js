"use strict";

const comrexSocket = require("@utils/comrex-socket");
const configGet = require("@core/config-get");
const mongoSingle = require("@core/mongo-single");

module.exports = async (peerId, peerName) => {
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
        const cmd = `<setPeerSettings id="${peerId}" name="${peerName}"/>`;
        console.log(`peer-rename: sending '${cmd}'`);
        device.send(cmd);
        setTimeout(() => {
            device.disconnect();
        }, 1000);

        // now we can assume it's worked, we should update the db
        const peerList = await mongoSingle.get("peerList");
        const foundPeer = peerList.find((peer) => peer.id === parseInt(peerId));
        foundPeer.name = peerName;
        await mongoSingle.set("peerList", peerList, 60);
        return true;
    } catch (error) {
        return false;
    }
};
