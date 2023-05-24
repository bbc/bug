"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (mongoCollectionName, itemDataArray, upsert = false) => {
    const collection = await mongoSingle.get(mongoCollectionName);
    for (const itemData of itemDataArray) {
        const matchingIndex = collection && collection.findIndex((x) => x.key === itemData.key);
        if (matchingIndex > -1) {
            console.log(
                `dbitem-update: updating item id ${itemData.key} at index ${matchingIndex} in collection ${mongoCollectionName}`
            );
            collection.splice(matchingIndex, 1, itemData);
        } else {
            if (upsert) {
                console.log(`dbitem-update:adding item id ${itemData.key} to collection ${mongoCollectionName}`);
                collection.push(itemData);
            } else {
                console.log(`dbitem-update: no matching item id ${itemData.key} in collection ${mongoCollectionName}`);
            }
        }
    }
    return await mongoSingle.set(mongoCollectionName, collection, 60);
};
