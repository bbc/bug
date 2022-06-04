"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async (hostId) => {
    try {
        const config = await configGet();
        const hostsCollection = await mongoCollection("hosts");
        const host = await hostsCollection.findOne({ hostId: hostId });

        return { ...host, ...config.hosts[hostId] };
    } catch (error) {
        return [];
    }
};
