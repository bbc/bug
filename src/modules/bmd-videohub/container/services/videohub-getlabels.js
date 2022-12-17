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
        console.log(`videohub-getlabels: failed to fetch config`);
        return false;
    }

    const dataCollection = await mongoCollection("data");

    const outputArray = {
        inputLabels: [],
        outputLabels: [],
    };

    // get data from the db
    const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
    if (dbInputLabels) {
        for (const [eachIndex, eachValue] of Object.entries(dbInputLabels["data"])) {
            const intIndex = parseInt(eachIndex);
            outputArray["inputLabels"].push({
                port: intIndex,
                oneBasedPort: intIndex + 1,
                label: eachValue,
            });
        }
    }

    // get data from the db
    const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
    if (dbOutputLabels) {
        for (const [eachIndex, eachValue] of Object.entries(dbOutputLabels["data"])) {
            const intIndex = parseInt(eachIndex);
            outputArray["outputLabels"].push({
                port: intIndex,
                oneBasedPort: intIndex + 1,
                label: eachValue,
            });
        }
    }

    return outputArray;
};
