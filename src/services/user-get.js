"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (id) => {
    try {
        if (id) {
            const user = await userModel.get(id);
            delete user.password;
            delete user.pin;
            return user;
        }
        return null;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve user.`);
    }
};
