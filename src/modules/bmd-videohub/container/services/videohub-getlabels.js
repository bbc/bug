"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        // fetch config
        const config = await configGet();
        if (!config) throw new Error("Failed to load config");

        const dataCollection = await mongoCollection("data");

        const outputArray = {
            inputLabels: [],
            outputLabels: [],
        };

        // get data from the db
        const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
        if (dbInputLabels) {
            for (const [eachIndex, eachValue] of Object.entries(dbInputLabels.data)) {
                const intIndex = parseInt(eachIndex);
                outputArray.inputLabels.push({
                    port: intIndex,
                    oneBasedPort: intIndex + 1,
                    label: eachValue,
                });
            }
        }

        // get data from the db
        const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
        if (dbOutputLabels) {
            for (const [eachIndex, eachValue] of Object.entries(dbOutputLabels.data)) {
                const intIndex = parseInt(eachIndex);
                outputArray.outputLabels.push({
                    port: intIndex,
                    oneBasedPort: intIndex + 1,
                    label: eachValue,
                });
            }
        }

        logger.info(
            `videohub-getlabels: retrieved ${outputArray.inputLabels.length} input labels and ${outputArray.outputLabels.length} output labels`
        );
        return outputArray;

    } catch (err) {
        logger.error(`videohub-getlabels: ${err.stack || err.message}`);
        err.message = `videohub-getlabels: ${err.message}`;
        throw err;
    }
};
