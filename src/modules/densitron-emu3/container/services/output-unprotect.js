"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (deviceIndex, outputIndex) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const protectValue = `${deviceIndex}/${outputIndex}`;

    if (!config.protectedOutputs.includes(protectValue)) {
        console.log(`output-unprotect: cannot find output ${protectValue}`);
        return false;
    }

    config.protectedOutputs = config.protectedOutputs.filter((item) => item !== protectValue);

    return await configPutViaCore(config);
};
