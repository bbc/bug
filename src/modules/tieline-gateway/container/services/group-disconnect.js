"use strict";

const TielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async (groupId) => {
    try {
        if (!groupId || typeof groupId !== "string") {
            throw new Error("invalid groupId");
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

        logger.info(`disconnecting from ${groupId}`);

        await tielineApi.post("/api/disconnect", { "group-id": groupId });

        logger.info(`disconnection from ${groupId} completed successfully`);

        return true;
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};