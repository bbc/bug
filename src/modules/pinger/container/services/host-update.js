"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (hostId, newHost) => {
    console.log(newHost);

    let config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.hosts[hostId]) {
        return false;
    }

    if (!config.hosts[hostId].hasOwnProperty("position") && !newHost.hasOwnProperty("position")) {
        newHost.position = { x: Math.random() * 1500, y: Math.random() * 1500 };
    }

    config.hosts[hostId] = { ...config.hosts[hostId], ...newHost };

    console.log(config.hosts[hostId]);
    return await configPutViaCore(config);
};
