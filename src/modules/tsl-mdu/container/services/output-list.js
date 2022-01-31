"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async (index) => {
    // we need the config for the protected state
    const config = await configGet();
    if (!config) {
        return false;
    }

    const outputsCollection = await mongoCollection("outputs");

    const outputList = await outputsCollection.find().toArray();

    for (let index in outputList) {
        // add protected state
        outputList[index]._protected = config.protectedOutputs?.includes(outputList[index]["number"]);
    }
    return outputList;
};
