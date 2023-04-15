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
        console.log(`ddm-getinputlabel: failed to fetch config`);
        return false;
    }

    const dataCollection = await mongoCollection("data");

    // get data from the db
    const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
    if (dbInputLabels && dbInputLabels["data"][index] !== undefined) {
        return dbInputLabels["data"][index];
    }

    return null;
};
