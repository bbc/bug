"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (id) => {
    try {
        if (id) {
            const user = await userModel.get(id);
            delete user?.password;
            return user;
        }
        return null;
    } catch (error) {
        logger.error(`user-get: ${error.stack}`);
        throw new Error(`Failed to retrieve user.`);
    }
};
