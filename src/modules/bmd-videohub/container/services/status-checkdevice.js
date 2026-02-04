"use strict";

const mongoCollection = require("@core/mongo-collection");
const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        // get data collection
        const dataCollection = await mongoCollection("data");

        // fetch input labels and count sources
        const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
        const sourceCount = Object.keys(dbInputLabels?.data ?? {}).length;

        // fetch output labels and count destinations
        const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
        const destinationCount = Object.keys(dbOutputLabels?.data ?? {}).length;

        // return status item
        return new StatusItem({
            message: `device active with ${sourceCount} source(s) and ${destinationCount} destination(s)`,
            key: "deviceactive",
            type: "default",
            flags: [],
        });

    } catch (err) {
        // log error and return empty array
        logger.error(`status-checkdevice: ${err.stack || err.message}`);
        return [];
    }
};
