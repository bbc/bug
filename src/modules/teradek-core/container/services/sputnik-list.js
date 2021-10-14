"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const sputniksCollection = await mongoCollection("sputniks");
        return await sputniksCollection.find().toArray();

    } catch (error) {
        return [];
    }
};
