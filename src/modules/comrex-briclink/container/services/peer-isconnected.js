"use strict";

const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");

// this is just awful. Basically if you're in a different group on the device, you can't tell if it's connected
// so we'll first of all check the peer list, then secondly check the levels.
// if they haven't been updated in the last 5 seconds we'll say we're not connected

module.exports = async () => {
    const peerList = await mongoSingle.get("peerList");
    const isAnyPeerConnected =
        peerList &&
        peerList.filter((peer) => peer.chan_state === "Connected" || peer.chan_state === "Requesting call").length > 0;

    if (isAnyPeerConnected) {
        console.log("peer connected");
        return true;
    } else {
        // we need to use mongoCollection rather than mongoSingle as otherwise we don't have access to the timestamp
        const dbPeerStats = await mongoCollection("peerStats");
        const result = await dbPeerStats.findOne({ type: "peerStats" });
        const nowTime = new Date();
        const diff = nowTime - result?.timestamp;
        return result && diff < 1000;
    }
};
