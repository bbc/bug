"use strict";

//TODO error handling with throw

const logger = require("@utils/logger");
const Db = require("@utils/db");
const collectionName = "dockercontainers";

const connect = async () => {
    const dbClass = new Db();
    const db = await dbClass.connect();
    if (!db) {
        logger.warning("could not connect to database");
        return false;
    }
    return db;
};

exports.get = async function (containerId) {
    try {
        let db = await connect();
        if (!db) {
            return null;
        }

        const result = await db.collection(collectionName).findOne({ containerid: containerId });
        if (result) {
            return result;
        }
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.set = async function (containerId, containerInfo) {
    try {
        let db = await connect();
        if (!db) {
            return false;
        }

        await db.collection(collectionName).replaceOne(
            {
                containerid: containerId,
            },
            containerInfo,
            {
                upsert: true,
            }
        );
        return true;
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
        return false;
    }
};

exports.setMultiple = async function (containerInfoArray) {
    try {
        let db = await connect();
        if (!db) {
            return false;
        }

        let idArray = [];
        for(let eachContainer of containerInfoArray) {
            idArray.push(eachContainer['containerid']);
            let result = await db.collection(collectionName).replaceOne(
                {
                    containerid: eachContainer['containerid'],
                },
                eachContainer,
                {
                    upsert: true,
                }
            );
        }

        // remove any unused
        let result = await db.collection(collectionName).deleteMany({
            containerid: {
                '$nin': idArray
            }
        });

        return true;
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
        return false;
    }
};

exports.list = async function (containerId) {
    try {
        let db = await connect();
        if (!db) {
            return null;
        }

        const result = await db.collection(collectionName).find().toArray();
        if (result) {
            return result;
        }
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};
