"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const downloadCollection = await mongoCollection("download-stats");
        return await downloadCollection.find().toArray();
    } catch (error) {
        return [];
    }
};
