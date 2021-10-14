"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (sid) => {
    try {
        const linksCollection = await mongoCollection("links");
        return await linksCollection.findOne({ encoderSid: sid });

    } catch (error) {
        return null;
    }
};
