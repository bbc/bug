"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (tracerouteId, newTraceroute) => {
    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.traceroutes[tracerouteId]) {
        return false;
    }

    config.traceroutes[tracerouteId] = { ...config.traceroutes[tracerouteId], ...newTraceroute };
    console.log(newTraceroute);
    console.log(config.traceroutes[tracerouteId]);
    return await configPutViaCore(config);
};
