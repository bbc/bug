"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (serviceId, newLocalData) => {
    // fetch hashed address of device to use as id
    // const deviceId = await deviceIdGet();

    // fetch the existing data
    const localdataCollection = await mongoCollection("localdata");
    // const localdata = await localdataCollection.findOne({"key": serviceId});
    // let existingData = await mongoSingle.get(`localdata_${deviceId}`);
    // if (!existingData) {
    //     existingData = {};
    // }
    // if (arrayName !== null && index !== null) {
    //     // we're updating an array item
    //     if (!existingData?.[arrayName]) {
    //         // we don't have a localdata version of this - let's copy it across
    //         let codecData = await mongoSingle.get("codecdata");
    //         existingData[arrayName] = codecData[arrayName];
    //     }
    //     if (!existingData[arrayName]?.[index]) {
    //         // it doesn't exist in codecdata - this is weird
    //         return false;
    //     }
    //     // overwrite the codecdata with the new value
    //     existingData[arrayName][index] = Object.assign(existingData[arrayName][index], newLocalData);
    // } else {
    //     // just update the main array
    //     existingData = Object.assign(existingData, newLocalData);
    // }

    // save and return
    return await localdataCollection.replaceOne(
        { key: serviceId },
        { key: serviceId, localdata: newLocalData },
        { upsert: true }
    );
};
