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
        logger.error(`videohub-getallsources: failed to fetch config`);
        return false;
    }

    const dataCollection = await mongoCollection("data");

    const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
    if (dbInputLabels) {
        return Object.values(dbInputLabels["data"]);
    }

    return null;
};
