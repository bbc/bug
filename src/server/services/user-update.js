"use strict";

const logger = require("@core/logger")(module);
const userModel = require("@models/user");

module.exports = async (uuid, user) => {
    try {
        return await userModel.update(uuid, user);
    } catch (error) {
        logger.error(`user-update: ${error.stack}`);
        throw new Error(`Failed to update user.`);
    }
};
