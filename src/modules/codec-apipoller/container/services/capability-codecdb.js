"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    return await mongoSingle.get("codecs");
};
