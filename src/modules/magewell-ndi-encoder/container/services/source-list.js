"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const sourcesCollection = await mongoCollection("sources");
        return await sourcesCollection.find().toArray();
    } catch (error) {
        return [];
    }
};
