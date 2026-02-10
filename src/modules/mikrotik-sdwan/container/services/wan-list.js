"use strict";

const mongoSingle = require('@core/mongo-single');
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

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

        // fetch routing tables from the database
        const dbTables = await mongoSingle.get('routingTables');

        // if the database call fails or returns non-array, we throw or return empty
        if (!dbTables) return [];
        if (!Array.isArray(dbTables)) {
            throw new Error("routing table data in database is malformed");
        }

        const prefix = config.routingTablePrefix;

        // filter tables by prefix/disabled state and then sort alphabetically
        return dbTables
            .filter(table => table.name?.startsWith(prefix) && !table.disabled && table.comment)
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