"use strict";

/**
 * core/status-checkmongosingle.js
 * Checks the mongo-single entry for stale data
 * Returns an array containing a single StatusItem if stale, empty array if good
 * 0.0.1 31/01/2022 - Created first version (GH)
 */

const mongoSingle = require("@core/mongo-single");
const StatusItem = require("@core/StatusItem");

module.exports = async (options) => {
    const defaults = {
        collectionName: undefined,
        message: "There is no recent data for this device",
        itemType: "error",
        flags: [],
    };
    options = Object.assign({}, defaults, options);

    if (options.collectionName === undefined) {
        console.error("status-checkmongosingle: collectionName not specified");
        return;
    }

    if (await mongoSingle.get(options.collectionName)) {
        return [];
    }

    return [
        new StatusItem({
            key: `stale${options.collectionName}data`,
            message: options.message,
            type: options.itemType,
            flags: options.flags,
        }),
    ];
};
