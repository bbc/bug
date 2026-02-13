"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const dbRoutes = await mongoSingle.get("routes") || [];
        const dbBridges = await mongoSingle.get("bridges") || [];
        const dbAddresses = await mongoSingle.get("addresses") || [];
        const pingCollection = await mongoCollection("ping");
        const wanAddressCollection = await mongoCollection("wanAddresses");
        const dbRules = await mongoSingle.get("rules") || [];

        if (!Array.isArray(dbRoutes)) {
            throw new Error("route data is malformed (expected array)");
        }

        if (!Array.isArray(dbBridges)) {
            throw new Error("bridge data is malformed (expected array)");
        }

        if (!Array.isArray(dbAddresses)) {
            throw new Error("address data is malformed (expected array)");
        }

        const pingResults = await pingCollection.find().toArray();
        const wanAddressResults = await wanAddressCollection.find().toArray();
        const ruleAddresses = dbRules.map((r) => r['src-address']) || [];

        return dbRoutes
            .map((route) => {

                // find matching bridge
                const bridge = route._bridgeName && dbBridges.find((b) => b.name === route._bridgeName);

                // find matching address (removing all that exist in the routing rules table)
                const matchingAddress = route._bridgeName && dbAddresses.find((a) => a.interface === route._bridgeName && !ruleAddresses.includes(a.address));

                // and matching ping (if it exists)
                const matchingPing = pingResults.find((p) => p.bridge === route._bridgeName);

                // and matching address (if it exists)
                const matchingWanAddress = wanAddressResults.find((w) => w.bridge === route._bridgeName);

                return {
                    id: route.id,
                    comment: route.dynamic ? bridge?.comment : route?.comment,
                    name: route._bridgeName,
                    interface: route.interface,
                    distance: route.distance,
                    disabled: route.disabled ?? false,
                    dynamic: route.dynamic,
                    active: route.active ?? false,
                    address: matchingAddress.address,
                    network: matchingAddress.network,
                    pingOk: matchingPing?.['avg-rtt'] ? true : false,
                    pingRtt: matchingPing?.['avg-rtt'],
                    wanAddress: matchingWanAddress?.address
                }
            })
            .sort((a, b) => (a.distance > b.distance ? 1 : -1))
    } catch (err) {
        err.message = `route-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
