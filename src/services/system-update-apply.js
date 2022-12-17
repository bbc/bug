"use strict";

const logger = require("@utils/logger")(module);
const bugContainer = process.env.BUG_CONTAINER || "app";

const watchtowerToken = process.env.WATCHTOWER_HTTP_API_TOKEN || "bugupdatetoken";
const watchtowerContainer = process.env.WATCHTOWER_CONTAINER || "watchtower";

const axios = require("axios");

module.exports = async () => {
    let response = {};
    try {
        const watchtowerResponse = await axios.get(`http://${watchtowerContainer}:8080/v1/update`, {
            timeout: 5000,
            headers: { Authorization: `Bearer ${watchtowerToken}` },
        });

        if (watchtowerResponse.status === 200) {
            response.data = { updating: true };
        } else {
            throw new Error(`Watchtower responsed with a code ${watchtowerResponse.status}`);
        }

        return response;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        response.error = error;
        return response;
    }
};
