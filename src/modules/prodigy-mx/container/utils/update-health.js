"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (deviceData) => {
    if (deviceData?.["fan"]) {
        let existingHealth = await mongoSingle.get("health");
        if (!existingHealth) {
            existingHealth = {};
        }

        const fields = [
            "imain",
            "power",
            "tach1_rpm",
            "tach2_rpm",
            "cpu_temp",
            "power",
            "temp1",
            "temp2",
            "temp_local",
            "temp_thres",
        ];

        for (let eachField of fields) {
            if (deviceData?.["fan"][eachField]) {
                existingHealth[eachField] = deviceData?.["fan"][eachField];
            }
        }

        // we have to do psu differently as it's an array
        if (deviceData?.["fan"]["psu"]) {
            existingHealth["psu"] = deviceData?.["fan"]?.["psu"]?.map((p) => p[1]);
        }

        return await mongoSingle.set("health", existingHealth);
    }
    return false;
};
