"use strict";
const logger = require("@core/logger")(module);

module.exports = async (collection, dataArray, idFieldName, update = false) => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return null;
    }

    const operations = dataArray.map((eachArrayItem) => {
        if (eachArrayItem?.[idFieldName] === undefined) {
            throw new Error(`mongo-savearray: missing id field '${idFieldName}'`);
        }

        const filter = { [idFieldName]: eachArrayItem[idFieldName] };

        if (update) {
            return {
                updateOne: {
                    filter,
                    update: { $set: eachArrayItem },
                    upsert: true,
                },
            };
        }

        return {
            replaceOne: {
                filter,
                replacement: eachArrayItem,
                upsert: true,
            },
        };
    });

    try {
        return await collection.bulkWrite(operations, { ordered: false });
    } catch (error) {
        logger.error(`mongo-savearray: ${error.stack || error || error.message}`);
        throw error;
    }
};
