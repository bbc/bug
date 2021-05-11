'use strict';

module.exports = async (collection, dataArray, idFieldName) => {
    for (let eachArrayItem of dataArray) {
        try {
            let matchArray = {};
            matchArray[idFieldName] = eachArrayItem[idFieldName];
            await collection.replaceOne(
                matchArray,
                eachArrayItem,
                { upsert: true }
            );
        } catch (error) {
            console.log(error);
        }
    }
}
