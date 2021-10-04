"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const devicesCollection = await mongoCollection("devices");
    const decoders = await devicesCollection
        .find({ type: "decoder" })
        .toArray();

    const filteredList = [];

    if (decoders) {
        for (const eachDecoder of decoders) {
            filteredList.push({
                "id": eachDecoder.sid,
                "name": eachDecoder.name
            });
        }
    }

    return filteredList;

};
