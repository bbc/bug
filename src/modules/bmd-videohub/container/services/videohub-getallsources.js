"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        const dataCollection = await mongoCollection("data");
        const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });

        if (!dbInputLabels || !dbInputLabels.data) {
            logger.warning("videohub-getallsources: no input labels found");
            return [];
        }

        const sources = Object.values(dbInputLabels.data);
        logger.info(`videohub-getallsources: retrieved ${sources.length} sources`);
        return sources;

    } catch (err) {
        err.message = `videohub-getallsources: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
