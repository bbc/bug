"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (index) => {
    try {
        // fetch config
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        const dataCollection = await mongoCollection("data");

        // get data from the db
        const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
        if (dbOutputLabels && dbOutputLabels.data[index] !== undefined) {
            return dbOutputLabels.data[index];
        }

        logger.warning(`no output label found for index ${index}`);
        return null;
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};
