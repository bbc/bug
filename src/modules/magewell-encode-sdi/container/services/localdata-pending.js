"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const localData = await mongoSingle.get("localdata");

    return !!(localData && Object.keys(localData).length > 0);
};