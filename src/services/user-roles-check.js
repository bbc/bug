"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (strategyRole, userRoles) => {
    console.log(userRoles);
    try {
        if (!strategyRole) {
            return true;
        }

        if (!userRoles) {
            return false;
        }

        if (!Array.isArray(userRoles)) {
            return false;
        }

        for (let userRole of userRoles) {
            if (strategyRole === userRole) {
                return true;
            }
        }

        return false;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed check user roles.`);
    }
};
