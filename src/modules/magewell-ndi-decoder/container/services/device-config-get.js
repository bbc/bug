"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const dataCollection = await mongoCollection("data");
        const config = await dataCollection.find({}).sort({ timestamp: -1 }).limit(1).toArray();
        return config[0];
    } catch (error) {
        return undefined;
    }
};
