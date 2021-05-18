"use strict";

/**
 * core/status-checkcollection.js
 * Checks the specified collection for stale data
 * Returns an array containing a single StatusItem if stale, empty array if good
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const mongoCollection = require("@core/mongo-collection");
const StatusItem = require("@core/StatusItem");

module.exports = async (collectionName, collectionDescription, timeoutSeconds = 10) => {
    const timeout = timeoutSeconds * 1000;

    const connection = await mongoCollection(collectionName);

    let latestDocument = await connection.find().sort({ timestamp: 1 }).limit(1).toArray();

    if (latestDocument && latestDocument.length === 1) {
        if (latestDocument[0]["timestamp"] < Date.now() - timeout) {
            return [
                new StatusItem({
                    key: `stale${collectionName}data`,
                    message: `There is no recent ${collectionDescription} data for this device`,
                    type: `critical`,
                }),
            ];
        }
    }
    return [];
};
