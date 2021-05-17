"use strict";

/**
 * core/mongo-collection.js
 * Returns a Mongo collection object, given the provided name
 * Also allows for creation of capped collections etc (if they don't already exist)
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const MongoDb = require("@core/mongo-db");

module.exports = async (collectionName, createOptions = null) => {
    try {
        if (!createOptions) {
            // we can just try to return it. If it doesn't exist, it'll be created
            return await MongoDb.db.collection(collectionName);
        }

        // otherwise check if it exists
        if (await MongoDb.db.listCollections({ name: collectionName }).hasNext()) {
            // it does - just return it
            return await MongoDb.db.collection(collectionName);
        }
        // otherwise we create it
        return await MongoDb.db.createCollection(collectionName, createOptions);
    } catch (err) {
        throw err;
    }
};
