"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const systemCollection = await mongoCollection("system");
    return await systemCollection.find().sort({ timestamp: -1 }).limit(1).toArray();
};
