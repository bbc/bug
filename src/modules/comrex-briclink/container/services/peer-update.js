"use strict";

const comrexSocket = require("@utils/comrex-socket");
const configGet = require("@core/config-get");
const mongoSingle = require("@core/mongo-single");

module.exports = async (peerId, formData) => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    let updateString = "<";
    updateString += `setPeerSettings id="${peerId}" `;
    if (formData.name) {
        updateString += `name="${formData.name}" `;
    }
    if (formData.addr) {
        updateString += `addr="${formData.addr}" `;
    }
    if (formData.profile !== undefined) {
        updateString += `profile="${formData.profile}" `;
    }
    if (formData.use_xlock !== undefined) {
        updateString += `use_xlock="${formData.use_xlock ? "true" : "false"}" `;
    }
    updateString += "/>";

    try {
        const device = new comrexSocket({
            host: config.address,
            port: config.port,
            username: config.username,
            password: config.password,
        });
        await device.connect();
        console.log(`peer-rename: sending '${updateString}'`);
        device.send(updateString);
        setTimeout(() => {
            device.disconnect();
        }, 1000);

        // now we can assume it's worked, we should update the db
        const peerList = await mongoSingle.get("peerList");
        const foundPeer = peerList.find((peer) => peer.id === parseInt(peerId));
        if (formData.name) {
            foundPeer.name = formData.name;
        }
        if (formData.addr) {
            foundPeer.addr = formData.addr;
        }
        if (formData.profile !== undefined) {
            foundPeer.profile = formData.profile;
        }
        if (formData.use_xlock !== undefined) {
            foundPeer.use_xlock = formData.use_xlock;
        }
        await mongoSingle.set("peerList", peerList, 60);
        return true;
    } catch (error) {
        return false;
    }
};
