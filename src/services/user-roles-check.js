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
                console.log(strategyRole, userRole);
                if (strategyRole === userRole) {
                    return true;
                }
            }
        }

        return false;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed check user roles.`);
    }
};
