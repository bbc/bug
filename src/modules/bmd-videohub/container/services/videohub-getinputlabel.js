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
        const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });

        if (dbInputLabels && dbInputLabels.data[index] !== undefined) {
            return dbInputLabels.data[index];
        }

        logger.warning(`videohub-getinputlabel: no input label found for index ${index}`);
        return null;

    } catch (err) {
        err.message = `videohub-getinputlabel: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
