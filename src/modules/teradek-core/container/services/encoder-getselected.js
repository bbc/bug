"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (index) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`devices-encoder-getselected: failed to fetch config`);
        return false;
    }

    const devicesCollection = await mongoCollection("devices");
    return await devicesCollection.find({ type: "encoder", sid: { $in: config["encoders"] } }).sort({ name: 1 }).toArray();
};
