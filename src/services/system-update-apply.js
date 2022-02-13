"use strict";

const logger = require("@utils/logger")(module);
const bugContainer = process.env.BUG_CONTAINER || "app";

const watchtowerToken = process.env.WATCHTOWER_HTTP_API_TOKEN || "bugupdatetoken";
const watchtowerContainer = process.env.WATCHTOWER_CONTAINER || "watchtower";

const axios = require("axios");

module.exports = async () => {
    try {
        const response = await axios.get(`http://${watchtowerContainer}:8080/v1/update`, {
            headers: { Authorization: `Bearer ${watchtowerToken}` },
        });

        console.log(response?.data);

        return response?.data;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed apply the bug update.`);
    }
};
