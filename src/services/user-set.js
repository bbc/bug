"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (user) => {
    try {
        return await userModel.set(user);
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed update user.`);
    }
};
