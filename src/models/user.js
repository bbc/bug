"use strict";

const logger = require("@utils/logger")(module);
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const path = require("path");

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
        const contents = { users: [] };
        if (await writeJson(filename, contents)) {
            return contents;
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
        const contents = await getUsers();
        const index = await getUserIndex(contents?.users, email);
        if (index === -1) {
            return null;
        }
        return contents?.users[index];
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.delete = async function (email) {
    try {
        const contents = await getUsers();
        const index = await getUserIndex(contents?.users, email);
        if (index === -1) {
            return null;
        }
        contents?.users.splice(index, 1);
        return await writeJson(filename, contents);
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.set = async function (user) {
    try {
        let contents = await getUsers();
        const index = await getUserIndex(contents?.users, user?.email);
        if (index !== -1) {
            contents.users[index] = user;
        } else {
            contents.users.push(user);
        }

        return await writeJson(filename, contents);
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.update = async function (user) {
    try {
        let contents = await getUsers();
        const index = await getUserIndex(contents?.users, user?.email);
        if (index !== -1) {
            contents.users[index] = { ...contents.users[index], ...user };
        } else {
            return null;
        }

        return await writeJson(filename, contents);
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};
