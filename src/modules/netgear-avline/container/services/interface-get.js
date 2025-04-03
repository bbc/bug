"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (port) => {
    const dbInterfaces = await mongoCollection("interfaces");
    return await dbInterfaces.findOne({ port: parseInt(port) });
};
