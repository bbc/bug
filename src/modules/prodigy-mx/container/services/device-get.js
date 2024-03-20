"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    return await mongoSingle.get("device");
};
