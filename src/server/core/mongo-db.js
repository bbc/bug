"use strict";

/**
 * core/mongo-db.js
 * Provides a single, reusable connection to the Mongo database
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const { MongoClient } = require("mongodb");
const logger = require("@core/logger")(module);
const mongoContainer = process.env.MONGO_CONTAINER || "bug-mongo";
const mongoPort = process.env.MONGO_PORT || "27017";
const url = `mongodb://${mongoContainer}:${mongoPort}`;
let isConnected;

class Mongo {
    constructor() {
        this.client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    async connect(dbName) {
        if (!isConnected) {
            logger.debug(`mongo-db: connecting to mongo db at ${url}`);
            await this.client.connect();
            isConnected = true;
            logger.info("mongo-db: connected to mongo db OK");
        }
        logger.debug(`mongo-db: opening database ${dbName}`);
        this.db = this.client.db(dbName);
    }
}

module.exports = new Mongo();
