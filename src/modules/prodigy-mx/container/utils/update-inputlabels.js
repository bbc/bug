"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (deviceData) => {
    if (deviceData?.["settings"]?.["input_labels"]) {
        let existingInputLabels = await mongoSingle.get("input_labels");
        if (!existingInputLabels) {
            existingInputLabels = [];
        }
        for (let eachItem of deviceData?.["settings"]?.["input_labels"]) {
            existingInputLabels[eachItem[0]] = eachItem;
        }
        return await mongoSingle.set("input_labels", existingInputLabels);
    }
    return false;
};
