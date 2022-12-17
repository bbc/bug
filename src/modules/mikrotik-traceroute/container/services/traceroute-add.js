"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const { v4: uuidv4 } = require("uuid");

module.exports = async (traceroute) => {
    const config = await configGet();

    if (!config) {
        return false;
    }

    if (traceroute.address && traceroute.name && traceroute.targetAddress) {
        //Trim
        traceroute.address = traceroute.address.trim();
        traceroute.name = traceroute.name.trim();
        traceroute.targetAddress = traceroute.targetAddress.trim();

        const tracerouteId = await uuidv4();
        config.traceroutes[tracerouteId] = traceroute;
    }

    return await configPutViaCore(config);
};
