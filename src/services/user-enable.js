"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (uuid, state) => {
    try {
        return await userModel.update(uuid, { enabled: state });
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed change the user state.`);
    }
};
