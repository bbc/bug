"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async () => {
    try {
        const response = {};
        response.data = await userModel.list();

        return response;
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed retrieve users.`);
    }
};
