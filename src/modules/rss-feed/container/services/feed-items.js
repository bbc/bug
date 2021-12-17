"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const feedCollection = await mongoCollection("feed");
        return await feedCollection.find().toArray();
    } catch (error) {
        return [];
    }
};
