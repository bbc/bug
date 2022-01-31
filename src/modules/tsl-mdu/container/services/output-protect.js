"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (outputNumber) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    if (config.protectedOutputs === undefined) {
        config.protectedOutputs = [];
    }

    if (config.protectedOutputs?.includes(parseInt(outputNumber))) {
        console.log(`output-protect: output ${outputNumber} already protected`);
        return false;
    }

    config.protectedOutputs.push(parseInt(outputNumber));
    return await configPutViaCore(config);
};
