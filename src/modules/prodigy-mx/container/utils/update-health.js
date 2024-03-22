"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (deviceData) => {
    if (deviceData?.["fan"]) {
        const health = {};
        console.log(deviceData["fan"]);
        health["imain"] = deviceData?.["fan"]?.["imain"];
        health["power"] = deviceData?.["fan"]?.["power"];
        health["psu"] = deviceData?.["fan"]?.["psu"].map((p) => p[1]);
        health["tach1_rpm"] = deviceData?.["fan"]?.["tach1_rpm"];
        health["tach2_rpm"] = deviceData?.["fan"]?.["tach2_rpm"];
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
