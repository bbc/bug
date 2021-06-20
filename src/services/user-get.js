"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (email) => {
    try {
        const response = {};
        response.data = await userModel.get(email);

        return response;
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed retrieve user.`);
    }
};
