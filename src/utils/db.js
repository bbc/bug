'use strict';
//TODO error handling with throw

const MongoClient = require('mongodb').MongoClient;
const logger = require('@utils/logger')(module);

module.exports = class Db {
    static dbObject;

    async connect() {
        const dbName = 'bug-core';
        if (Db.dbObject === undefined) {

            // Connection URL
            const url = 'mongodb://bug-mongo:27017';

            // Database Name
            const client = new MongoClient(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            // try to connect
            try {
                await client.connect();

                // and save it to static var 
                Db.dbObject = client;
            } catch (err) {
                logger.error(err.stack);
            }
        }

        // return the database object
        return Db.dbObject.db(dbName);
    }

    async disconnect() {
        if (Db.dbObject !== undefined) {
            try {
                logger.debug('disconnecting database');
                await Db.dbObject.close();
                logger.debug('done');
            } catch (err) {
                logger.error(error.trace);
            }
        }
        else {
            logger.warning(`nothing to disconnect!`);
        }
    }
}