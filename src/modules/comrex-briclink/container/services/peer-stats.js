"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const peerStats = await mongoSingle.get("peerStats");

    return peerStats;
};
