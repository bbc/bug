"use strict";

const logger = require("@utils/logger")(module);
const Db = require("@utils/db");
const collectionName = "logs";

const connect = async () => {
    const dbClass = new Db();
    const db = await dbClass.connect();
    if (!db) {
        logger.warn("could not connect to database");
        return false;
    }
    return db;
};

exports.get = async function (level) {
    try {
        let db = await connect();
        if (!db) {
            return null;
        }
        const result = await db.collection(collectionName).find({level:level}).toArray();
        return result
    } catch (error) {
        logger.warn(`${error.trace || error || error.message}`);
    }
    return null;
};