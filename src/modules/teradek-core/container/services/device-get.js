"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (sid) => {
    try {
        const devicesCollection = await mongoCollection("devices");
        return await devicesCollection.findOne({ sid: sid });

    } catch (error) {
        return null;
    }
};
