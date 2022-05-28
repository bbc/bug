"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (hostId) => {
    try {
        const hostsCollection = await mongoCollection("hosts");
        return await hostsCollection.findOne({ hostId: hostId });
    } catch (error) {
        return [];
    }
};
