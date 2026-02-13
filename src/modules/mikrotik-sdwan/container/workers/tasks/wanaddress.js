"use strict";

const delay = require("delay");
const logger = require("@core/logger")(module);

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

        // filter routes to only enabled and static
        const filteredRoutes = dbRoutes.filter(route => !route.disabled && !route.dynamic);

        const fetchTasks = filteredRoutes.map(async (route) => {
            try {
                const bridgeAddresses = dbAddresses.filter(addr => addr.interface === route._bridgeName);

                let matchingRule = null;
                for (const addr of bridgeAddresses) {
                    matchingRule = dbRules.find(rule => rule['src-address'] === addr.address);
                    if (matchingRule) break;
                }

                if (!matchingRule) return null;

                const address = matchingRule['src-address'].includes('/')
                    ? matchingRule['src-address'].split('/')[0]
                    : matchingRule['src-address'];

                logger.info(`fetch: from ${address} via bridge ${route._bridgeName}`);

                // Do the ping check
                const data = await conn.write("/tool/fetch", [
                    `=src-address=${address}`,
                    `=url=https://ifconfig.me/ip`,
                    `=mode=https`,
                    `=output=user`,
                ]);

                const dbWanAddressResult = {
                    bridge: route._bridgeName,
                    address,
                    table: matchingRule.table,
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

function parsePing(pingStr) {
    const regex = /(\d+)(s|ms|us)/g;
    let match;
    let totalMs = 0;
    let found = false;

    while ((match = regex.exec(pingStr)) !== null) {
        found = true;
        const value = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case "s":
                totalMs += value * 1000;
                break;
            case "ms":
                totalMs += value;
                break;
            case "us":
                totalMs += value / 1000;
                break;
        }
    }

    return found ? totalMs : null;
}