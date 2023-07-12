"use strict";

const MDU = require("@utils/mdu");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (index, state) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const mdu = await MDU(config);
    const response = await mdu.setOutput(index, state);

    if (response.status !== 200) {
        console.log(response.output);
        return false;
    }

    // update the db
    const outputsCollection = await mongoCollection("outputs");
    await outputsCollection.updateOne({ number: parseInt(index) }, { $set: { state: state } });

    return true;
};
