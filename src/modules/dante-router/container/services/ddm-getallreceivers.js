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

    const domainCollection = await mongoCollection("domain");
    console.log(config);
    const dbOutputLabels = await domainCollection.findOne({ name: config.domain });
    if (dbOutputLabels) {
        return Object.values(dbOutputLabels["data"]);
    }

    return null;
};
