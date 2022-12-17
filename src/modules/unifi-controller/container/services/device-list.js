"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const devicesCollection = await mongoCollection("devices");
        return await devicesCollection.find().toArray();
    } catch (error) {
        return [];
    }
};
