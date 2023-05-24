"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (serviceId) => {
    const localdataCollection = await mongoCollection("localdata");
    const localdata = await localdataCollection.findOne({ key: serviceId });
    if (localdata) {
        return localdata?.localdata;
    }
    return null;
};
