"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (outputNumber) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    if (!config.protectedOutputs.includes(parseInt(outputNumber))) {
        console.log(`output-unprotect: cannot find output ${outputNumber}`);
        return false;
    }

    config.protectedOutputs = config.protectedOutputs.filter((item) => item !== parseInt(outputNumber));

    return await configPutViaCore(config);
};
