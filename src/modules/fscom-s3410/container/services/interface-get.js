"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId) => {
    const dbInterfaces = await mongoCollection("interfaces");
    return await dbInterfaces.findOne({ interfaceId: parseInt(interfaceId) });
};
