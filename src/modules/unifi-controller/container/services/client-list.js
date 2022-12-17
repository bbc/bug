"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (deviceMac) => {
    try {
        const clientsCollection = await mongoCollection("clients");
        return await clientsCollection.find({ deviceMac: deviceMac }).toArray();
    } catch (error) {
        return [];
    }
};
