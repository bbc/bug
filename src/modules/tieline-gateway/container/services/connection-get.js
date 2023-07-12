"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (connectionId) => {
    const connectionsCollection = await mongoCollection("connections");
    return await connectionsCollection.findOne({ id: connectionId });
};
