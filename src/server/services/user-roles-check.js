"use strict";

const logger = require("@utils/logger")(module);

module.exports = (strategyRoles, userRoles) => {
    try {
        if (!strategyRoles) {
            return true;
        }

        if (!userRoles) {
            return true;
        }

        if (!Array.isArray(strategyRoles)) {
            return false;
        }

        if (!Array.isArray(userRoles)) {
            return false;
        }

        for (let strategyRole of strategyRoles) {
            for (let userRole of userRoles) {
                if (strategyRole === userRole) {
                    return true;
                }
            }
        }

        return false;
    } catch (error) {
        logger.error(`user-roles-check: ${error.stack}`);
        throw new Error(`Failed to check user roles`);
    }
};
