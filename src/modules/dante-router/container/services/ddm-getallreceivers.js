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
        console.log(`ddm-getallreceivers: failed to fetch config`);
        return false;
    }

    const receviersCollection = await mongoCollection("receivers");
    const receiverLabels = await receviersCollection.find().toArray();

    console.log(receiverLabels);

    return receiverLabels;
};
