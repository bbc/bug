"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        const config = await configGet();
        const hostsCollection = await mongoCollection("hosts");
        const mergedHosts = [];
        const hosts = {};

        for (let item of await hostsCollection.find().toArray()) {
            hosts[item?.hostId] = item;
        }

        for (let hostId in config?.hosts) {
            if (hosts?.[hostId]) {
                mergedHosts.push({
                    ...hosts?.[hostId],
                    ...config.hosts[hostId],
                    ...{
                        data: hosts?.[hostId].data.slice(
                            hosts?.[hostId]?.data.length - 1 - 50,
                            hosts?.[hostId]?.data.length - 1
                        ),
                    },
                });
            } else {
                mergedHosts.push(config.hosts[hostId]);
            }
        }

        return await mergedHosts;
    } catch (error) {
        console.log(error);
        return [];
    }
};
