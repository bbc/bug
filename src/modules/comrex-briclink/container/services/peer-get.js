"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (peerId) => {
    const peerList = await mongoSingle.get("peerList");

    return peerList && (await peerList.find((peer) => peer.id === parseInt(peerId)));
};
