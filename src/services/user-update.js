"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");
const hash = require("@utils/hash");

module.exports = async (uuid, user) => {
    try {
        if (user.password) {
            user.password = await hash(user.password);
        }

        if (user.pin) {
            user.pin = await hash(user.pin);
        }

        return await userModel.update(uuid, user);
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed update user.`);
    }
};
