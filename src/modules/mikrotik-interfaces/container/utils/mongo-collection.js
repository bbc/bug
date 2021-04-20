'use strict';

const MongoDb = require('../utils/mongo-db');

module.exports = async (collectionName) => {

    try {
        return await MongoDb.db.collection(collectionName);
    } catch (err) {
        throw err;
    }

}