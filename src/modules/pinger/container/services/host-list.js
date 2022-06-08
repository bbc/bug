"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const config = await configGet();
        const hostsCollection = await mongoCollection("hosts");
        const hosts = await hostsCollection.find().toArray();

        let mergedHosts = [];

        mergedHosts = hosts.map((host) => {
            return {
                ...host,
                ...config.hosts[host.hostId],
                ...{ data: host.data.slice(host.data.length - 1 - 50, host.data.length - 1) },
            };
        });

        return await mergedHosts;
    } catch (error) {
        return [];
    }
};
