"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (decoder = 0) => {
    const collection = await mongoCollection("receiver");
    const recieverData = await collection.findOne();

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
    statusBlocks.push({
        label: "Battery",
        state: recieverData.decoders[decoder].batteryVoltage ? "success" : "inactive",
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

    return statusBlocks;
};
