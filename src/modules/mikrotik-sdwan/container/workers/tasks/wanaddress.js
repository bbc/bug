"use strict";

const delay = require("delay");
const logger = require("@core/logger")(module);
const srcAddressGet = require('@utils/srcaddress-get');

module.exports = async ({ conn, mongoSingle, wanAddressesCollection }) => {

    try {
        await delay(2000);
        if (!conn) {
            throw new Error("no connection provided");
        }

        // get a list of all default routes
        const dbRoutes = await mongoSingle.get("routes") || [];
        const dbAddresses = await mongoSingle.get("addresses") || [];
        const dbRules = await mongoSingle.get("rules") || [];

        if (!Array.isArray(dbRoutes)) {
            throw new Error("route data is malformed (expected array)");
        }

        if (!Array.isArray(dbAddresses)) {
            throw new Error("address data is malformed (expected array)");
        }

        if (!Array.isArray(dbRules)) {
            throw new Error("rule data is malformed (expected array)");
        }

        if (dbRoutes.length === 0 || dbRules.length === 0) {
            return true;
        }

        // filter routes to only enabled
        const filteredRoutes = dbRoutes.filter(route => !route.disabled);

        const fetchTasks = filteredRoutes.map(async (route) => {
            try {
                const address = srcAddressGet(route, dbAddresses, dbRules);
                if (!address) return null;

                logger.info(`fetch: from ${address} via bridge ${route._bridgeName}`);

                // do the fetch
                const data = await conn.write("/tool/fetch", [
                    `=src-address=${address}`,
                    `=url=https://ifconfig.me/ip`,
                    `=mode=https`,
                    `=output=user`,
                ]);

                const dbWanAddressResult = {
                    bridge: route._bridgeName,
                    address,
                    "address": data[1]?.["data"],
                    timestamp: Date.now()
                };

                await wanAddressesCollection.replaceOne({ address }, dbWanAddressResult, { upsert: true });

                return true;

            } catch (err) {
                logger.error(`wanaddress: failed for route ${route._bridgeName}: ${err.message}`);
                return null; // continue even on failure
            }
        });

        // run all in parallel
        const results = await Promise.allSettled(fetchTasks);

        const successfulCount = results
            .filter(r => r.status === "fulfilled" && r.value).length
        const failedCount = results.length - successfulCount;

        logger.info(`wanaddress: ${successfulCount} address fetch(es) successful`);

        if (failedCount) {
            logger.warning(`wanaddress: ${failedCount} address fetch(es) failed`);
        }
        return true;
    } catch (error) {
        // log and re-throw so the worker loop handles the exit/restart
        console.error(`wanaddress: ${error.message}`);
        throw error;
    }
};

