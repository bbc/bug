"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`videohub-getalldestinations: failed to fetch config`);
        return false;
    }

    const dataCollection = await mongoCollection("data");

    const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
    if (dbOutputLabels) {
        return Object.values(dbOutputLabels["data"]);
    }

    return null;
};
