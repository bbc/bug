"use strict";

const delay = require("delay");
const logger = require("@core/logger")(module);
const loopbackAddressGet = require('@utils/loopbackaddress-get');

module.exports = async ({ routerOsApi, mongoSingle, wanAddressesCollection }) => {

    try {
        await delay(2000);

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
            logger.warning("No routes or rules found, skipping fetch");
            return true;
        }

        // filter routes to only enabled
        const filteredRoutes = dbRoutes.filter(route => route?.['routing-table'] === "main");

        const fetchTasks = filteredRoutes.map(async (route) => {
            try {
                const address = loopbackAddressGet(route, dbAddresses, dbRules);
                if (!address) return null;

                logger.debug(`Fetching WAN address from ${address} via bridge ${route._bridgeName}`);

                // do the fetch
                const data = await routerOsApi.conn.write("/tool/fetch", [
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

                await wanAddressesCollection.replaceOne({ bridge: route._bridgeName }, dbWanAddressResult, { upsert: true });

                return true;

            } catch (err) {
                logger.error(`WAN address fetch failed for route ${route._bridgeName}: ${err.message}`);
                return null; // continue even on failure
            }
        });

        // run all in parallel
        const results = await Promise.allSettled(fetchTasks);

        const successfulCount = results
            .filter(r => r.status === "fulfilled" && r.value).length
        const failedCount = results.length - successfulCount;

        logger.info(`${successfulCount} address fetch(es) successful`);

        if (failedCount) {
            logger.warning(`${failedCount} address fetch(es) failed`);
        }
        return true;
    } catch (error) {
        // log and re-throw so the worker loop handles the exit/restart
        logger.error(error.message);
        throw error;
    }
};

