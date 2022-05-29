"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (hostId) => {
    let config = await configGet();
    const hostsCollection = await mongoCollection("hosts");

    if (!config) {
        return false;
    }

    if (!config.hosts.hostId) {
        return false;
    }

    delete config.hosts.hostId;
    hostsCollection.deleteOne({ hostId: hostId });

    return await configPutViaCore(config);
};
