"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async () => {
    try {
        const response = {};
        response.data = await userModel.list();

        response.data.sort(function (a, b) {
            return b.email - a.email;
        });

        return response;
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed retrieve users.`);
    }
};
