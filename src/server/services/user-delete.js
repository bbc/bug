"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (uuid) => {
    try {
        return await userModel.delete(uuid);
    } catch (error) {
        logger.error(`user-delete: ${error.stack}`);
        throw new Error(`Failed to delete user.`);
    }
};
