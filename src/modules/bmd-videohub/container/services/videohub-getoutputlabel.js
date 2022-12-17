"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (index) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`videohub-getoutputlabel: failed to fetch config`);
        return false;
    }

    const dataCollection = await mongoCollection("data");

    // get data from the db
    const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
    if (dbOutputLabels && dbOutputLabels["data"][index] !== undefined) {
        return dbOutputLabels["data"][index];
    }

    return null;
};
