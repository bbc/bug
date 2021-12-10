"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    //TODO add local modifications
    return await mongoSingle.get("codecdata");
};
