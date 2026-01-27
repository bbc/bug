"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategies");

module.exports = async (headers) => {
    try {
        const strategyList = await strategyModel.list();

        for (let eachStrategy of strategyList) {
            if (eachStrategy.enabled && eachStrategy.type === "proxy") {
                const userId = headers?.[eachStrategy?.headerField?.toLowerCase()];
                if (userId) {
                    return userId;
                }
            }
        }
        return false;
    } catch (error) {
        logger.error(`user-getproxyid: ${error.stack}`);
        throw new Error(`Failed to retrieve user proxy id.`);
    }
};
