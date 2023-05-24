"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (serviceId) => {
    const localdataCollection = await mongoCollection("localdata");
    return await localdataCollection.deleteOne({ key: serviceId });
};
