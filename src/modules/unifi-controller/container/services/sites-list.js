"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const sitesCollection = await mongoCollection("sites");
        return await sitesCollection.find().toArray();
    } catch (error) {
        return [];
    }
};
