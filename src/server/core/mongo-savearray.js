"use strict";

module.exports = async (collection, dataArray, idFieldName, update = false) => {
    for (let eachArrayItem of dataArray) {
        try {
            let matchArray = {};
            matchArray[idFieldName] = eachArrayItem[idFieldName];

            if (update) {
                await collection.updateOne(matchArray, { $set: eachArrayItem }, { upsert: true });
            } else {
                await collection.replaceOne(matchArray, eachArrayItem, { upsert: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
};
