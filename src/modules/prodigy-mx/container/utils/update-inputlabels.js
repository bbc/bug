"use strict";

const mongoSingle = require("@core/mongo-single");

const testLabels = [
    [1666, "Sine Tone 1"],
    [1667, "Sine Tone 2"],
    [1668, "White Noise 1"],
    [1669, "White Noise 2"],
    [1670, "Pink Noise 1"],
    [1671, "Pink Noise 2"],
];

module.exports = async (deviceData) => {
    if (deviceData?.["settings"]?.["input_labels"]) {
        let existingInputLabels = await mongoSingle.get("input_labels");
        if (!existingInputLabels) {
            existingInputLabels = [];
        }
        for (let eachItem of deviceData?.["settings"]?.["input_labels"]) {
            existingInputLabels[eachItem[0]] = eachItem;
        }

        // add the test sources to the array
        existingInputLabels = existingInputLabels.concat(testLabels);

        // and save it
        return await mongoSingle.set("input_labels", existingInputLabels);
    }
    return false;
};
