"use strict";

const logger = require("@utils/logger")(module);
const checkUpdate = require("@services/system-update-check");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");
const mongoDb = require("@core/mongo-db");

const databaseName = process.env.BUG_CONTAINER || "bug";

module.exports = async () => {
    try {
        const response = await checkUpdate();

        await mongoDb.connect(databaseName);
        const updateCollection = await mongoCollection("updates");
        await updateCollection.deleteMany({});

        await mongoSaveArray(updateCollection, [{ ...{ status: response.status }, ...response.data }], "checkTime");

        return response;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        return { status: "error,", message: "Could cache update", error: error };
    }
};
