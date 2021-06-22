"use strict";

const logger = require("@utils/logger")(module);
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const filename = path.join(__dirname, "..", "config", "global", "users.json");

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

async function getUsers() {
    try {
        return await readJson(filename);
    } catch (error) {
        const users = [];
        if (await writeJson(filename, users)) {
            return users;
        }
        throw error;
    }
}

exports.list = async function () {
    try {
        return await getUsers();
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.get = async function (email) {
    try {
        const users = await getUsers();
        const index = await getUserIndex(users, email);
        if (index === -1) {
            return null;
        }
        return users[index];
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.delete = async function (email) {
    try {
        const users = await getUsers();
        const index = await getUserIndex(users, email);
        if (index === -1) {
            return null;
        }
        users.splice(index, 1);
        return await writeJson(filename, users);
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.set = async function (user) {
    try {
        let users = await getUsers();
        const index = await getUserIndex(users, user?.email);
        if (index !== -1) {
            //User already exists - do nothing.
            return false;
        } else {
            //Create a new user with a UUID
            user.uuid = await uuidv4();
            user.enabled = false;
            users.push(user);
            return await writeJson(filename, users);
        }
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.update = async function (user) {
    try {
        let users = await getUsers();
        const index = await getUserIndex(users, user?.email);
        if (index !== -1) {
            users[index] = { ...users[index], ...user };
        } else {
            return null;
        }

        return await writeJson(filename, users);
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};
