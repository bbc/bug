"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const linksCollection = await mongoCollection("links");
        return await linksCollection.find().toArray();

    } catch (error) {
        return [];
    }
};
