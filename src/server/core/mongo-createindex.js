"use strict";

/**
 * core/mongo-createindex.js
 * Creates an index in a collection
 * If it already exists, updates with the provided options
 * 0.0.1 07/07/2021 - Created first version (GH)
 */

const MongoDb = require("@core/mongo-db");

module.exports = async (collection, indexName, options = {}) => {
    if (!MongoDb.db) {
        throw new Error("MongoDB has not been initialised");
    }

    try {
        const indexDetails = {};
        indexDetails[indexName] = 1;
        options['name'] = indexName;
        await collection.createIndex(indexDetails, options);

    } catch (err) {
        if (err.message.indexOf("with different options")) {
            console.log(
                `mongo-createindex: index '${indexName}' already exists with different options - updating instead`
            );
        } else {
            throw err;
        }
    }

    // we only get here if it already exists (and has been through the try/catch) - update index ttl instead
    MongoDb.db.command({
        collMod: collection.collectionName,
        index: options,
    });

}
