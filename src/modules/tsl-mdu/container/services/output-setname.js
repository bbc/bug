"use strict";

const MDU = require("@utils/mdu");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (index, name) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const mdu = await MDU(config);
    const response = await mdu.setName(index, name);

    if (response.status !== 200) {
        console.log(response.output);
        return false;
    }

    // update the db
    const outputsCollection = await mongoCollection("outputs");
    await outputsCollection.updateOne({ number: parseInt(index) }, { $set: { name: name } });

    return true;
};
