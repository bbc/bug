"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (mongoCollectionName, idsToDelete) => {
    if (!idsToDelete || idsToDelete.length === 0) {
        console.log(`dbitem-delete: no items to delete from collection ${mongoCollectionName}`);
        return true;
    }
    const collection = await mongoSingle.get(mongoCollectionName);
    console.log(`dbitem-delete: deleting ${idsToDelete.length} item(s) from collection ${mongoCollectionName}`);
    const filteredCollection = collection.filter((c) => !idsToDelete.includes(c.key));
    console.log(
        `dbitem-delete: removed ${
            collection.length - filteredCollection.length
        } item(s) from collection ${mongoCollectionName}`
    );
    return await mongoSingle.set(mongoCollectionName, filteredCollection, 60);
};
