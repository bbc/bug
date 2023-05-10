"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (serviceId) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    if (!config.protectedServices.includes(serviceId)) {
        console.log(`service-unprotect: cannot find service ${serviceId}`);
        return false;
    }

    console.log(`service-unprotect: unprotecting service ${serviceId}`);

    config.protectedServices = config.protectedServices.filter((item) => item !== serviceId);

    return await configPutViaCore(config);
};
