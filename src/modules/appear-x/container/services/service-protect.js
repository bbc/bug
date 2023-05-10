"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (serviceId) => {
    const config = await configGet();
    if (!config) {
        return false;
    }
    if (!config.protectedServices) {
        config.protectedServices = [];
    }
    if (config.protectedServices.includes(serviceId)) {
        console.log(`encoderservice-protect: service ${serviceId} already protected`);
        return false;
    }
    console.log(`encoderservice-protect: protecting service ${serviceId}`);
    config.protectedServices.push(serviceId);
    return await configPutViaCore(config);
};
