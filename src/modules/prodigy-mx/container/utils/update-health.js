"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (deviceData) => {
    if (deviceData?.["fan"]) {
        const health = {};
        health["cpu_temp"] = deviceData?.["fan"]?.["cpu_temp"];
        health["power"] = deviceData?.["fan"]?.["power"];
        health["temp1"] = deviceData?.["fan"]?.["temp1"];
        health["temp2"] = deviceData?.["fan"]?.["temp2"];
        health["temp_local"] = deviceData?.["fan"]?.["temp_local"];
        health["temp_thres"] = deviceData?.["fan"]?.["temp_thres"];

        return await mongoSingle.set("health", health, 60);
    }
    return false;
};
