"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    // fetch info
    const chassisInfo = await mongoSingle.get("chassisInfo");

    let features = [];

    if (chassisInfo) {
        for (const eachCard of chassisInfo?.cards) {
            features = features.concat(eachCard.value.features);
        }

        features = [...new Set(features)];
    }
    return features;
};
