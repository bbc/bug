"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (deviceIndex, outputIndex) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const protectValue = `${deviceIndex}/${outputIndex}`;

    if (config.protectedOutputs?.includes(protectValue)) {
        console.log(`output-protect: output ${protectValue} already protected`);
        return false;
    }

    config.protectedOutputs.push(protectValue);
    return await configPutViaCore(config);
};
