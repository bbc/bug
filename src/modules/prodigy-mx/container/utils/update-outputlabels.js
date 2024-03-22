"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (deviceData) => {
    if (deviceData?.["settings"]?.["output_labels"]) {
        let existingOutputLabels = await mongoSingle.get("output_labels");
        if (!existingOutputLabels) {
            existingOutputLabels = [];
        }
        for (let eachItem of deviceData["settings"]["output_labels"]) {
            existingOutputLabels[eachItem[0]] = eachItem;
        }
        return await mongoSingle.set("output_labels", existingOutputLabels, 60);
    }
    return false;
};
