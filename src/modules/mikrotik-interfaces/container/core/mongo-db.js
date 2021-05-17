'use strict';

/**
 * core/mongo-db.js
 * Provides a single, reusable connection to the Mongo database
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const { MongoClient } = require("mongodb");
const url = `mongodb://bug-mongo:27017`;

class Mongo {
    constructor() {
        this.client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    async connect(dbName) {
        if (!this.client.isConnected()) {
            console.log(`mongo-db: connecting to mongo db at ${url}`);
            await this.client.connect();
            console.log("mongo-db: connected to mongo db OK");
        }
        console.log(`mongo-db: opening database ${dbName}`);
        this.db = this.client.db(dbName);
    }
}

module.exports = new Mongo();
