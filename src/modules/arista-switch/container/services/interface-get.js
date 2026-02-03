"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId) => {
    const interfaces = await mongoCollection("interfaces");
    return interfaces.findOne({ interfaceId });
};
