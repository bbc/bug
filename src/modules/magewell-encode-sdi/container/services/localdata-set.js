"use strict";

const mongoSingle = require("@core/mongo-single");
const deepMerge = require("@utils/deep-merge");

module.exports = async (newLocalData) => {
    const existingData = (await mongoSingle.get("localdata")) || {};
    const mergedData = deepMerge(existingData, newLocalData || {});

    return await mongoSingle.set("localdata", mergedData);
};