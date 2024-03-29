"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (decoder = 0) => {
    const collection = await mongoCollection("receiver");
    let recieverData = await collection.find({}).sort({ timestamp: -1 }).limit(1).toArray();
    recieverData = recieverData[0];

    // group into nice status blocks
    const statusBlocks = [];

    if (!recieverData) {
        return [];
    }
    // Video Lock
    statusBlocks.push({
        label: "Video Lock",
        state: recieverData.decoders[decoder].videoLock ? "success" : "inactive",
        items: [recieverData.decoders[decoder].videoLock ? "Locked" : "No Video"],
    });

    //Battery Voltage
    let batteryState = "inactive";
    if (recieverData.decoders[decoder].batteryVoltage > 14) {
        batteryState = "success";
    } else if (recieverData.decoders[decoder].batteryVoltage > 12) {
        batteryState = "warning";
    } else if (recieverData.decoders[decoder].batteryVoltage < 12) {
        batteryState = "error";
    }

    statusBlocks.push({
        label: "Battery",
        state: batteryState,
        items: [
            recieverData.decoders[decoder].batteryVoltage
                ? `${recieverData.decoders[decoder].batteryVoltage}V`
                : "No Battery",
        ],
    });

    //Frequency
    statusBlocks.push({
        label: "Frequency",
        state: recieverData.decoders[decoder].frequency ? "success" : "inactive",
        items: [recieverData.decoders[decoder].frequency ? `${recieverData.decoders[decoder].frequency}MHz` : "MHz"],
    });

    //Errors

    let errorState = "inactive";
    if (recieverData.decoders[decoder].postErrors === 0) {
        errorState = "success";
    } else if (recieverData.decoders[decoder].postErrors < 100) {
        errorState = "warning";
    } else if (recieverData.decoders[decoder].postErrors > 100) {
        errorState = "error";
    }

    statusBlocks.push({
        label: "Errors",
        state: errorState,
        items: [
            isNaN(recieverData.decoders[decoder].postErrors)
                ? "N/A"
                : `${recieverData.decoders[decoder].postErrors} bytes`,
        ],
    });

    return statusBlocks;
};
