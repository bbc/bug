"use strict";

/**
 * core/status-checkcollection.js
 * Checks the specified collection for stale data
 * Returns an array containing a single StatusItem if stale, empty array if good
 * 0.0.1 17/05/2021 - Created first version (GH)
 * 0.0.2 23/06/2021 - Now uses options object for properties (GH)
 */

const mongoCollection = require("@core/mongo-collection");
const StatusItem = require("@core/StatusItem");

module.exports = async (options) => {
    const defaults = {
        collectionName: undefined,
        message: "There is no recent data for this device",
        itemType: "error",
        timeoutSeconds: 10,
        flags: [],
    };
    options = Object.assign({}, defaults, options);

    const timeout = options.timeoutSeconds * 1000;

    const connection = await mongoCollection(options.collectionName);
    if (!connection) {
        console.log(`status-checkcollection: collection ${options.collectionName} not found`);
        return;
    }

    let latestDocument = await connection.find().sort({ timestamp: -1 }).limit(1).toArray();

    if (latestDocument && latestDocument.length === 1) {
        if (latestDocument[0]["timestamp"] < Date.now() - timeout) {
            return [
                new StatusItem({
                    key: `stale${options.collectionName}data`,
                    message: options.message,
                    type: options.itemType,
                    flags: options.flags,
                }),
            ];
        }
    }
    return [];
};
