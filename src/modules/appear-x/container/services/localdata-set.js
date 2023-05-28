"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (serviceId, newLocalData) => {
    // fetch hashed address of device to use as id
    // const deviceId = await deviceIdGet();

    // fetch the existing data
    const localdataCollection = await mongoCollection("localdata");

    // save and return
    return await localdataCollection.replaceOne(
        { key: serviceId },
        { key: serviceId, localdata: newLocalData },
        { upsert: true }
    );
};
