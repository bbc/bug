"use strict";

const mongoSingle = require("@core/mongo-single");

const updateItem = (existingItemFromDb, valuesArray) => {
    let existingItem = existingItemFromDb ?? [];
    for (let eachItem of valuesArray) {
        existingItem[eachItem[0]] = eachItem[1];
    }
    return existingItem;
};

module.exports = async (deviceData) => {
    if (deviceData?.["status"]) {
        let status = await mongoSingle.get("status");
        if (!status) {
            status = {};
        }

        status["clock_source"] = deviceData?.["status"]?.["clock_source"];
        status["madi"] = updateItem(status["madi"], deviceData?.["status"]?.["madi"]);
        status["madi_config"] = updateItem(status["madi_config"], deviceData?.["status"]?.["madi_config"]);
        status["module_type"] = updateItem(status["module_type"], deviceData?.["status"]?.["module_type"]);
        status["net"] = updateItem(status["net"], deviceData?.["status"]?.["net"]);
        status["net_module_state"] = updateItem(
            status["net_module_state"],
            deviceData?.["status"]?.["net_module_state"]
        );
        status["warnings"] = deviceData?.["status"]?.["warnings"];
        return await mongoSingle.set("status", status);
    }
    return false;
};
