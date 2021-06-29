"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (id) => {
    try {
        return await userModel.get(id);
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve user.`);
    }
};
