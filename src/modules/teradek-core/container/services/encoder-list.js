"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const devicesCollection = await mongoCollection("devices");
    const encoders = await devicesCollection
        .find({ type: "encoder" })
        .toArray();

    const filteredList = [];

    if (encoders) {
        for (const eachEncoder of encoders) {
            filteredList.push({
                "id": eachEncoder.sid,
                "name": eachEncoder.name
            });
        }
    }

    return filteredList;

};
