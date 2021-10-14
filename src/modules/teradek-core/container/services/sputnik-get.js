"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (identifier) => {
    try {
        const sputniksCollection = await mongoCollection("sputniks");
        return await sputniksCollection.findOne({
            identifier: identifier,
        });

    } catch (error) {
        return null;
    }
};
