"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

async function getUserIndex(users, feildValue, feildName) {
    if (users && feildValue && feildName) {
        const index = await users
            .map(function (user) {
                return user[feildName];
            })
            .indexOf(feildValue);
        return index;
    }
    return -1;
}

module.exports = async (userFeildValue, userFeildName) => {
    try {
        const users = await userModel.list();
        const index = await getUserIndex(users, userFeildValue, userFeildName);
        if (index !== -1) {
            return users[index];
        }

        return null;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to retrieve user by ${userFeildName}`);
    }
};
