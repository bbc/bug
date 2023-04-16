"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`ddm-getalltransmitters: failed to fetch config`);
        return false;
    }

    const transmittersCollection = await mongoCollection("transmitters");
    const transmittersLabels = await transmittersCollection.find().toArray();

    return transmittersLabels;
};
