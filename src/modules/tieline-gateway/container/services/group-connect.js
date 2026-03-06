"use strict";

const TielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (groupId) => {
    try {
        if (!groupId) {
            throw new Error("invalid group id");
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

        logger.info(`connecting to ${groupId}`);

        await tielineApi.post("/api/connect", { "group-id": groupId });

        logger.info(`connection to ${groupId} completed successfully`);

        return true;
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};