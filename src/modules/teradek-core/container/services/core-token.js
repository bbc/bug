"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (index) => {
    try {
        const tokenCollection = await mongoCollection("token");
        return await tokenCollection.findOne();

    } catch (error) {
        return null;
    }
};
