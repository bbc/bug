"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const config = await configGet();
        const hostsCollection = await mongoCollection("hosts");
        const hosts = await hostsCollection.find().toArray();

        const mergedHosts = hosts.map((host) => {
            return { ...host, ...config.hosts[host.hostId] };
        });

        return await mergedHosts;
    } catch (error) {
        return [];
    }
};
