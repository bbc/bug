"use strict";

const TielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (connectionId) => {

    try {
        if (!connectionId) {
            throw new Error(`${serviceName}: invalid connectionId`);
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        const tielineApi = new TielineApi({
            host: config.address,
            username: config.username,
            password: config.password,
        });

        logger.info(`disconnecting from ${connectionId}`);

        await tielineApi.post("/api/disconnect", { "cxn-id": connectionId });

        logger.info(`completed successfully`);

        return true;
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};