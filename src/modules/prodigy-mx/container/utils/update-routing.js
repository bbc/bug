"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (deviceData) => {
    if (deviceData?.["settings"]?.["easy_routing"]) {
        let existingRouting = await mongoSingle.get("routing");
        if (!existingRouting) {
            existingRouting = [];
        }
        for (let eachItem of deviceData["settings"]["easy_routing"]) {
            existingRouting[eachItem[0]] = eachItem;
        }
        return await mongoSingle.set("routing", existingRouting);
    }
    return false;
};
