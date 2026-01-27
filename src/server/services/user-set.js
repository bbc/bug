"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (user) => {
    try {
        return await userModel.set(user);
    } catch (error) {
        logger.error(`user-set: ${error.stack}`);
        throw new Error(`Failed to update user.`);
    }
};
