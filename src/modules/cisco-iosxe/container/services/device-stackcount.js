"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const dbInterfaces = await mongoCollection("interfaces");
    const result = await dbInterfaces.distinct("device");
    if (result.length === 1 && result[0] === null) {
        return null;
    }
    return result;
};
