"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const hostsCollection = await mongoCollection("hosts");
        const hosts = await hostsCollection.find().toArray();
        return await hosts;
    } catch (error) {
        return [];
    }
};
