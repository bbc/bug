"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`videohub-getalldestinations: failed to fetch config`);
        return false;
    }

    const dataCollection = await mongoCollection("data");

    const returnArray = [];
    const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
    const dbOutputRouting = await dataCollection.findOne({ title: "video_output_routing" });
    const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });

    if (dbOutputLabels && dbOutputRouting && dbInputLabels) {
        // loop through and add routing
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
};
