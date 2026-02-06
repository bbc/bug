"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        const dataCollection = await mongoCollection("data");

        const returnArray = [];
        const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
        const dbOutputRouting = await dataCollection.findOne({ title: "video_output_routing" });
        const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });

        if (dbOutputLabels && dbOutputRouting && dbInputLabels) {
            for (const [index, element] of Object.entries(dbOutputLabels.data)) {
                returnArray.push({
                    outputIndex: parseInt(index),
                    outputLabel: element,
                    inputIndex: parseInt(dbOutputRouting.data[index]),
                    inputLabel: dbInputLabels.data[dbOutputRouting.data[index]],
                });
            }
        }

        return returnArray;

    } catch (err) {
        err.message = `capability-videorouter: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
