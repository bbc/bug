"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const labels = await mongoSingle.get("output_labels");
    return labels.map((label) => {
        return label[1];
    });
};
