"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        const dataCollection = await mongoCollection("data");
        const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });

        if (!dbOutputLabels || !dbOutputLabels.data) {
            logger.warning("videohub-getalldestinations: no output labels found");
            return [];
        }

        const destinations = Object.values(dbOutputLabels.data);
        logger.info(`videohub-getalldestinations: retrieved ${destinations.length} destinations`);
        return destinations;

    } catch (err) {
        err.message = `videohub-getalldestinations: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
