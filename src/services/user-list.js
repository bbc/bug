"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async (sanitisePasswords = true) => {
    try {
        const userList = await userModel.list();
        if (sanitisePasswords) {
            for (let eachUser of userList) {
                const passwordLength = eachUser.passwordLength ? eachUser.passwordLength : 16;
                const pinLength = eachUser.pinLength ? eachUser.pinLength : 4;
                eachUser.password = "*".repeat(passwordLength);
                eachUser.pin = "*".repeat(pinLength);
            }
        }
        return userList.sort((a, b) => (a.username > b.username ? 1 : -1));
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve users.`);
    }
};
