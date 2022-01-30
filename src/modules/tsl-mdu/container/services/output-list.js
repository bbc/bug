"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const outputsCollection = await mongoCollection("outputs");
    return await outputsCollection.find().toArray();
};
