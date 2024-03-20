"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (deviceData) => {
    if (deviceData?.["settings"]?.["input_slot_name"]) {
        let existingInputSlotNames = await mongoSingle.get("input_slot_name");
        if (!existingInputSlotNames) {
            existingInputSlotNames = [];
        }
        for (let eachItem of deviceData["settings"]["input_slot_name"]) {
            existingInputSlotNames[eachItem[0]] = eachItem[1];
        }
        return await mongoSingle.set("input_slot_name", existingInputSlotNames, 60);
    }
    return false;
};
