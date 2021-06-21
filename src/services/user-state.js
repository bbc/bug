"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (email, state) => {
    try {
        const response = {};
        response.data = await userModel.update({ email: email, state: state });

        return response;
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed change the user state.`);
    }
};
