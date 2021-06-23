"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

async function getUserIndex(users, pin) {
    if (users && pin) {
        const index = await users
            .map(function (user) {
                return user?.pin;
            })
            .indexOf(pin);
        return index;
    }
    return -1;
}

module.exports = async (pin) => {
    try {
        const users = await userModel.list();
        const index = await getUserIndex(users, pin);
        if (index === -1) {
            return null;
        }
        return users[index];
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed retrieve user.`);
    }
};
