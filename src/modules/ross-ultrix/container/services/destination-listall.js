"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {

    // get db source labels
    const destinations = await mongoSingle.get("destinations");
    return destinations?.map((s) => s.name) ?? [];
};