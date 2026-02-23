"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");
const freeIpApiLookup = require("@utils/freeipapi-lookup");
const srcAddressGet = require("@utils/srcaddress-get");

module.exports = async () => {
    try {
        const dbRoutes = await mongoSingle.get("routes") || [];
        const dbBridges = await mongoSingle.get("bridges") || [];
        const dbAddresses = await mongoSingle.get("addresses") || [];
        const pingCollection = await mongoCollection("ping");
        const wanAddressCollection = await mongoCollection("wanAddresses");
        const dbRules = await mongoSingle.get("rules") || [];

        if (!Array.isArray(dbRoutes)) throw new Error("route data is malformed (expected array)");
        if (!Array.isArray(dbBridges)) throw new Error("bridge data is malformed (expected array)");
        if (!Array.isArray(dbAddresses)) throw new Error("address data is malformed (expected array)");

        const pingResults = await pingCollection.find().toArray();
        const wanAddressResults = await wanAddressCollection.find().toArray();

        const results = await Promise.all(
            dbRoutes.map(async (route) => {

                const bridge = route._bridgeName && dbBridges.find(
                    (b) => b.name === route._bridgeName
                );

                const lanAddress = srcAddressGet(route, dbAddresses, dbRules);

                const matchingPing = pingResults.find(
                    (p) => p.bridge === route._bridgeName
                );

                const matchingWanAddress = wanAddressResults.find(
                    (w) => w.bridge === route._bridgeName
                );

                const geoIp = matchingWanAddress
                    ? await freeIpApiLookup(
                        matchingWanAddress.address.split("/")[0]
                    )
                    : null;

                return {
                    id: route.id,
                    comment: route.dynamic ? bridge?.comment : route?.comment,
                    name: route._bridgeName,
                    interface: route.interface,
                    distance: route.distance,
                    disabled: route.disabled ?? false,
                    dynamic: route.dynamic,
                    active: route.active ?? false,
                    address: lanAddress,
                    pingOk: matchingPing?.latest?.["avg-rtt"] != null ? true : matchingPing ? false : null,
                    pingRtt: matchingPing?.latest?.["avg-rtt"],
                    pingHistory: matchingPing?.history || [],
                    wanAddress: matchingWanAddress?.address,
                    geoIp
                };
            })
        );

        return results.sort((a, b) => (a.distance > b.distance ? 1 : -1));

    } catch (err) {
        err.message = `route-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};