"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const labelObjects = await mongoSingle.get("routerlabels");
    const returnArray = [];
    if (labelObjects) {
        for (let eachLabel of labelObjects) {
            returnArray[eachLabel.outputIndex] = eachLabel.outputLabel;
        }
    }
    return returnArray;
};
