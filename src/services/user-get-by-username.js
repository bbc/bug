"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

async function getUserIndex(users, username) {
    if (users && username) {
        const index = await users
            .map(function (user) {
                return user?.username;
            })
            .indexOf(username);
        return index;
    }
    return -1;
}

module.exports = async (username) => {
    try {
        const users = await userModel.list();
        const index = await getUserIndex(users, username);
        if (index !== -1) {
            return users[index];
        }

        return null;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to retrieve user by username`);
    }
};
