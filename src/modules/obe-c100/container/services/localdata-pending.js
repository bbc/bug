"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    // fetch local data
    const localData = await mongoSingle.get("localdata");

    return localData && Object.keys(localData).length > 0;
};
