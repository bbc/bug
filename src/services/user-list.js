"use strict";

const logger = require("@utils/logger")(module);
const userModel = require("@models/user");

module.exports = async () => {
    try {
        const userList = await userModel.list();
        return userList.sort((a, b) => (a.username > b.username ? 1 : -1));
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve users.`);
    }
};
