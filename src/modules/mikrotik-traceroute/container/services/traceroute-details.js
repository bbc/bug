"use strict";

const configGet = require("@core/config-get");

module.exports = async (tracerouteId) => {
    try {
        const config = await configGet();
        return config.traceroutes[tracerouteId];
    } catch (error) {
        return [];
    }
};
