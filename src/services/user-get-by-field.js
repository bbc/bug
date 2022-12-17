"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

async function getUserIndex(users, fieldValue, fieldName) {
    if (users && fieldValue && fieldName) {
        const index = await users
            .map(function (user) {
                return user[fieldName];
            })
            .indexOf(fieldValue);
        return index;
    }
    return -1;
}

module.exports = async (userFieldValue, userFieldName) => {
    try {
        const users = await userModel.list();
        const index = await getUserIndex(users, userFieldValue, userFieldName);
        if (index !== -1) {
            return users[index];
        }

        return null;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to retrieve user by ${userFieldName}`);
    }
};
