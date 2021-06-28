"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

async function getUserIndex(users, name) {
    if (users && name) {
        const index = await users
            .map(function (user) {
                return user?.name;
            })
            .indexOf(name);
        return index;
    }
    return -1;
}

module.exports = async (name) => {
    try {
        const users = await userModel.list();
        const index = await getUserIndex(users, name);
        if (index !== -1) {
            return users[index];
        }

        return null;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to retrieve users`);
    }
};
