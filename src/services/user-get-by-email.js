"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

async function getUserIndex(users, email) {
    if (users && email) {
        const index = await users
            .map(function (user) {
                return user?.email;
            })
            .indexOf(email);
        return index;
    }
    return -1;
}

module.exports = async (email) => {
    try {
        const users = await userModel.list();
        const index = await getUserIndex(users, email);
        if (index !== -1) {
            return users[index];
        }

        return null;
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed retrieve users.`);
    }
};
