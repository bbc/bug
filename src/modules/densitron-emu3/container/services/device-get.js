"use strict";

const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");

module.exports = async (deviceIndex) => {
    const system = await mongoSingle.get("system");

    // we also add the output names from the config
    const config = await configGet();
    if (!config) {
        return false;
    }

    let deviceToReturn = system.devices.find((device) => device.deviceIndex === parseInt(deviceIndex));
    for (let index in deviceToReturn.outputs) {
        const outputIndex = deviceToReturn.outputs[index]["outputIndex"];
        if (config.outputNames[deviceIndex]?.[outputIndex]) {
            deviceToReturn.outputs[index].outputName = config.outputNames[deviceIndex]?.[outputIndex];
        } else {
            deviceToReturn.outputs[index].outputName = `Output ${outputIndex}`;
        }

        // check protected state
        deviceToReturn.outputs[index]._protected = config.protectedOutputs?.includes(`${deviceIndex}/${outputIndex}`);
    }
    return deviceToReturn;
};
