"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    // overwrite localdata with nothing
    return await mongoSingle.set("localdata", {});
};
