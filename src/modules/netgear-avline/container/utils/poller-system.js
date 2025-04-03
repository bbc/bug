"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (NetgearApi) => {

    // fetch system info
    const result = await NetgearApi.get({ path: "device_info" });
    if (result?.deviceInfo) {
        const payload = {
            serialNumber: result.deviceInfo?.serialNumber,
            model: result.deviceInfo?.model,
            memoryUsage: result.deviceInfo?.memoryUsage,
            cpuUsage: result.deviceInfo?.cpuUsage,
            fanState: result.deviceInfo?.fanState,
            temperatureSensors: result.deviceInfo?.temperatureSensors
        }
        await mongoSingle.set("system", payload, 120);
    }

};
