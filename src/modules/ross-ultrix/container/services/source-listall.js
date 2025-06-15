"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {

    // get db source labels
    const sources = await mongoSingle.get("sources");
    return sources?.map((s) => s.name) ?? [];
};
