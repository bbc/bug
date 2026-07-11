"use strict";

const logger = require("@core/logger")(module);
const axios = require("axios");
const modulePort = process.env.PORT;

module.exports = async ({ workerData, mongoSingle }) => {
    let codecs = [];

    if (workerData?.codecSource) {
        const url = `http://${workerData.codecSource}:${modulePort}/api/capabilities/codec-db`;
        logger.debug(`fetching codec db from '${url}'`);
        try {
            const response = await axios.get(url);
            if (response?.data?.status === "success" && Array.isArray(response?.data?.data)) {
                codecs = response.data.data;
            }
        } catch (error) {
            logger.error(error.stack || error.message || error);
            throw error;
        }
    } else {
        logger.warning("no codecSource configured; skipping codec db fetch");
    }

    await mongoSingle.set("codecdb", codecs, 60);
    logger.debug(`stored ${codecs.length} codec db records`);
};
