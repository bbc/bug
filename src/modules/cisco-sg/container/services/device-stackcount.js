"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const dbInterfaces = await mongoCollection("interfaces");
    return await dbInterfaces.distinct("device");
};
