"use strict";

const mongoSingle = require("@core/mongo-single");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (collectionName, resultObject, filterFields = [], maxAge = 120) => {
    const collection = await mongoCollection("history");

    let storedDocument = await collection.findOne({ name: collectionName });
    if (!storedDocument) {
        storedDocument = {
            name: collectionName,
            data: [],
        };
    }

    // filter the results to only include the keys in filterFields
    const dataToStore = Object.keys(resultObject)
        .filter((key) => filterFields.includes(key))
        .reduce((cur, key) => {
            return Object.assign(cur, { [key]: resultObject[key] });
        }, {});

    // add timestamp
    dataToStore["timestamp"] = Date.now();

    // add to the array
    storedDocument.data.push(dataToStore);

    // limit the array to a maximum age
    const oldestTimestamp = Date.now() - maxAge * 1000;
    storedDocument.data = storedDocument.data.filter((item) => item.timestamp > oldestTimestamp);

    // store in the db
    await collection.replaceOne({ name: collectionName }, storedDocument, { upsert: true });
};
