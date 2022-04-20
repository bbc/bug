"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const uploadCollection = await mongoCollection("upload-stats");
        return await uploadCollection.find().toArray();
    } catch (error) {
        return [];
    }
};
