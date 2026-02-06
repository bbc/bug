"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (user) => {
    try {
        if (typeof user?.username === "string") {
            user.username = user.username.trim().toLowerCase();
        }

        if (typeof user?.email === "string") {
            user.email = user.email.trim().toLowerCase();
        }

        return await userModel.set(user);
    } catch (error) {
        logger.error(`user-set: ${error.stack}`);
        throw new Error(`Failed to update user.`);
    }
};
