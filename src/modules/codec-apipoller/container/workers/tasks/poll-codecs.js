"use strict";

const logger = require("@core/logger")(module);
const axios = require("axios");
const mongoSingle = require("@core/mongo-single");

module.exports = async ({ workerData }) => {
    const apiUrl = workerData?.url;

    if (!apiUrl) {
        logger.warning("No API URL configured; skipping poll cycle.");
        return;
    }

    try {
        logger.debug(`Polling codec API at '${apiUrl}'`);

        const response = await axios.post(apiUrl, undefined, {
            timeout: 20000,
        });

        if (!Array.isArray(response?.data)) {
            logger.warning("API response was not an array; skipping update.");
            return;
        }

        await mongoSingle.set("codecs", response.data, 600);
        logger.debug(`stored ${response.data.length} codec records`);
    } catch (error) {
        logger.error(error.stack || error.message || error);
        throw error;
    }
};
