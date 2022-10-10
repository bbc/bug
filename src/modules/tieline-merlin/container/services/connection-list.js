"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const connectionsCollection = await mongoCollection("connections");
    return await connectionsCollection.find().toArray();
};
