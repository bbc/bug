"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");
const bcrypt = require("bcryptjs");

module.exports = async (pin) => {
    try {
        const users = await userModel.list();

        for (let user of users) {
            if (await bcrypt.compare(pin, user.pin)) {
                return user;
            }
        }

        return null;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve user by pin.`);
    }
};
