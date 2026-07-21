"use strict";

const axios = require("axios");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

const modulePort = process.env.PORT;

module.exports = async ({ workerData }) => {
    logger.debug("fetching codec-db ...");

    let codecs = [];

    if (workerData?.codecSource) {
        const url = `http://${workerData.codecSource}:${modulePort}/api/capabilities/codec-db`;
        try {
            const response = await axios.get(url);
            if (response?.data?.status === "success" && Array.isArray(response?.data?.data)) {
                codecs = response.data.data;
            }
        } catch (error) {
            logger.debug(error.stack || error.message || error);
        }
    }

    await mongoSingle.set("codecdb", codecs, 60);
};
