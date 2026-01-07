"use strict";

/**
 * core/mongo-single.js
 * Use this class to store a single value in a collection
 * Note that mongo-db must already be connected first
 * 0.0.1 08/11/2021 - Created first version (GH)
 */

const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const MongoDb = require("@core/mongo-db");

const clear = async (name) => {
    if (MongoDb.db) {
        const collectionList = await MongoDb.db
            .listCollections()
            .map((collection) => collection.name)
            .toArray();

        if (collectionList && collectionList.includes(name)) {
            await MongoDb.db.collection(name).drop();
        }
    }
};

const get = async (name) => {
    const collection = await mongoCollection(name);
    if (collection) {
        const document = await collection.findOne({ type: name });
        if (document && document.payload) {
            return document.payload;
        }
    }
    return null;
};

const set = async (name, value, ttl = null) => {
    try {
        const collection = await mongoCollection(name);
        if (ttl) {
            await mongoCreateIndex(collection, "timestamp", { expireAfterSeconds: ttl });
        }
        const document = {
            type: name,
            payload: value,
            timestamp: new Date(),
        };
        await collection.replaceOne({ type: name }, document, { upsert: true });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = {
    get: get,
    set: set,
    clear: clear,
};
