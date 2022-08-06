"use strict";

const mongoCollection = require("@core/mongo-collection");
const e = require("express");

module.exports = async (startTime = null, endTime = null) => {
    try {
        if (endTime === null) {
            endTime = Date.now();
        }

        if (startTime === null) {
            startTime = endTime - 60 * 5 * 1000; // 5 mins
        }

        const networkCollection = await mongoCollection("network");

        let history = await networkCollection
            .find({ timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) } })
            .toArray();

        history.map((item) => {
            delete item._id;
            item.timestamp = new Date(item.timestamp).getTime();
            return item;
        });

        return history;
    } catch (error) {
        console.log(`network-history: ${error.stack || error.trace || error || error.message}`);
    }
};
