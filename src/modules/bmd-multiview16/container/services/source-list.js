"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const labels = await mongoSingle.get("input_labels");
    return labels ? Object.values(labels) : [];
};
