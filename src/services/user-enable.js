"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (uuid, state) => {
    try {
        const user = await userModel.update(uuid, { enabled: state });
        if (state) {
            logger.info(`Enabled User: ${uuid}`);
        } else {
            logger.info(`Disabled User: ${uuid}`);
        }
        return user;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed change the user state.`);
    }
};
