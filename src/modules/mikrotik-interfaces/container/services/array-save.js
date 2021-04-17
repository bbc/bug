'use strict';

module.exports = async (db, dataArray, idFieldName) => {
    for (let eachArrayItem of dataArray) {
        try {
            let matchArray = {};
            matchArray[idFieldName] = eachArrayItem[idFieldName];
            await db.replaceOne(
                matchArray,
                eachArrayItem,
                { upsert: true }
            );
        } catch (error) {
            console.log(error);
        }
    }
}
