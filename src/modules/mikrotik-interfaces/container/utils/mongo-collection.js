'use strict';

const MongoDb = require('../utils/mongo-db');

module.exports = async (collectionName, createOptions = null) => {

    try {
        if(!createOptions) {
            // we can just try to return it. If it doesn't exist, it'll be created
            return await MongoDb.db.collection(collectionName);
        }

        // otherwise check if it exists
        if(await MongoDb.db.listCollections({ name: collectionName }).hasNext()) {
            // it does - just return it
            return await MongoDb.db.collection(collectionName);
        }
        // otherwise we create it
        return await MongoDb.db.createCollection(collectionName, createOptions);
    } catch (err) {
        throw err;
    }

}