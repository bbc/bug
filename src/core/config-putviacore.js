"use strict";

/**
 * core/configputviacore.js
 * Sends the provided config object back to the BUG API to be stored
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

const axios = require("axios");

module.exports = async (config) => {
    if (!config) {
        console.log(`config-putviacore: no config passed`);
        return false;
    }

    if (!config.id) {
        console.log(`config-putviacore: no ID value in config object`);
        return false;
    }

    const corePort = process.env.CORE_PORT;
    const coreHost = process.env.CORE_HOST;
    const panelId = process.env.PANEL_ID;

    const url = `http://${coreHost}:${corePort}/api/panelconfig/${panelId}`;
    try {
        // make the request
        let response = await axios.put(url, config);
        return response?.data?.status === "success";
    } catch (error) {
        console.log(`config-putviacore: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
};
