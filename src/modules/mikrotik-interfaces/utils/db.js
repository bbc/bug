'use strict';

const MongoClient = require('mongodb').MongoClient;
// const Logger = require('@services/logger');

module.exports = class Db {
    static dbObject;

    async connect() {
        const dbName = 'bug';
        if (Db.dbObject === undefined) {

            // Connection URL
            const url = 'mongodb://localhost:27017/' + dbName;

            // Database Name
            const client = new MongoClient(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            // try to connect
            try {
                // Logger.debug(`db->connect: attempting connection to database using url ${url}`);
                await client.connect();

                // and save it to static var 
                Db.dbObject = client;
            } catch (err) {
                // Logger.error(error.trace);
            }
        }

        // return the database object
        return Db.dbObject.db(dbName);
    }

    async disconnect() {
        if (Db.dbObject !== undefined) {
            try {
                // Logger.debug('db->disconnect: disconnecting database');
                await Db.dbObject.close();
                // Logger.debug('db->disconnect: done');
            } catch (err) {
                // Logger.error(error.trace);
            }
        }
        else {
            // Logger.warn(`db->disconnect: nothing to disconnect!`);
        }
    }
}