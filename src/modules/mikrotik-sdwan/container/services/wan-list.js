"use strict";

const mongoSingle = require('@core/mongo-single');
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        // load config to get the required prefix
        const config = await configGet();

        // if config is missing, this is a system error
        if (!config) {
            throw new Error("failed to retrieve system configuration");
        }

        // if prefix is missing, we can't filter, so return empty list
        if (!config.routingTablePrefix) {
            logger.info("wan-list: no routing table prefix defined in config");
            return [];
        }

        // fetch data from the database
        const pingCollection = await mongoCollection("ping");
        const [dbTables, dbRoutes, pingResults] = await Promise.all([
            mongoSingle.get('routingTables'),
            mongoSingle.get('routes'),
            pingCollection.find().toArray() ?? []
        ]);

        // if the database call fails or returns non-array, we throw or return empty
        if (!dbTables || !dbRoutes) return [];
        if (!Array.isArray(dbTables) || !Array.isArray(dbRoutes)) {
            throw new Error("database is malformed");
        }

        const prefix = config.routingTablePrefix;

        // filter tables by prefix/disabled state and then sort alphabetically
        return dbTables
            .filter(table => table.name?.startsWith(prefix) && !table.disabled && table.comment)
            .map((t) => {
                // find the route in the relevant routing table (eg rtab-180)
                const matchingRoute = dbRoutes.find((r) => r?.['routing-table'] === t.name);
                if (!matchingRoute) {
                    logger.warning(`wan-list: no default route found in routing table ${t.name}`);
                }

                // now we can find any ping results for this bridge name
                let matchingPing = null
                if (matchingRoute?._bridgeName) {
                    matchingPing = pingResults.find((p) => p.bridge === matchingRoute?._bridgeName);
                }

                return {
                    ...t,
                    pingOk: matchingPing?.latest?.["avg-rtt"] != null ? true : matchingPing ? false : null,
                }
            })
            .sort((a, b) => {
                const commentA = a.comment || '';
                const commentB = b.comment || '';
                return commentA.localeCompare(commentB);
            });

    } catch (err) {
        err.message = `wan-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};