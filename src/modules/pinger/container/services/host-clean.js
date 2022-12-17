"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (hosts) => {
    if (!hosts) {
        return false;
    }
    const hostlist = [];
    const hostsCollection = await mongoCollection("hosts");
    const hostsInDb = await hostsCollection.find({}).toArray();

    for (let host in hosts) {
        hostlist.push(host);
    }

    for (let host of hostsInDb) {
        if (!hostlist.includes(host.hostId)) {
            await hostsCollection.deleteOne({ hostId: host.hostId });
        }
    }

    return true;
};
