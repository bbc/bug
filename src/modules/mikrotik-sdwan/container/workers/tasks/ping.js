"use strict";

const delay = require("delay");
const logger = require("@core/logger")(module);
const srcAddressGet = require('@utils/srcaddress-get');

module.exports = async ({ conn, mongoSingle, pingCollection }) => {

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

        const pingTasks = filteredRoutes.map(async (route) => {
            try {

                const address = srcAddressGet(route, dbAddresses, dbRules);
                if (!address) return null;

                logger.debug(`ping: from ${address} via bridge ${route._bridgeName}`);

                // Do the ping check
                const data = await conn.write("/tool/ping", [
                    `=src-address=${address}`,
                    `=address=8.8.8.8`,
                    `=count=4`
                ]);

                const latestResult = {
                    "avg-rtt": parsePing(data?.[3]?.['avg-rtt']),
                    "min-rtt": parsePing(data?.[3]?.['min-rtt']),
                    "max-rtt": parsePing(data?.[3]?.['max-rtt']),
                };

                // save ping result
                await pingCollection.updateOne(
                    { address },
                    {
                        $set: {
                            address,
                            bridge: route._bridgeName,
                            latest: latestResult,
                            timestamp: Date.now()

                        },
                        $push: {
                            history: {
                                $each: [latestResult["avg-rtt"]],
                                $slice: -10
                            }
                        }
                    },
                    { upsert: true }
                );

                return true;

            } catch (err) {
                logger.error(`ping: failed for route ${route._bridgeName}: ${err.stack || err.message}`);
                return null; // continue even on failure
            }
        });

        // run all in parallel
        const results = await Promise.allSettled(pingTasks);

        const successfulCount = results
            .filter(r => r.status === "fulfilled" && r.value).length
        const failedCount = results.length - successfulCount;

        logger.info(`ping: ${successfulCount} ping check(s) successful`);

        if (failedCount) {
            logger.warning(`ping: ${failedCount} ping check(s) failed`);
        }
        return true;
    } catch (error) {
        // log and re-throw so the worker loop handles the exit/restart
        console.error(`ping: ${error.message}`);
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