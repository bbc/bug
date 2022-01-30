"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (index) => {
    const outputsCollection = await mongoCollection("outputs");
    return await outputsCollection.findOne({
        number: parseInt(index),
    });
};
