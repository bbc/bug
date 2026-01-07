"use strict";

const logger = require("@utils/logger")(module);
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const hash = require("@utils/hash");

const filename = path.join(__dirname, "..", "config", "global", "users.json");

const defaultFilename = path.join(__dirname, "..", "config", "default", "users.json");

async function getUserIndex(users, id) {
    if (users && id) {
        const index = await users
            .map(function (user) {
                return user?.id;
            })
            .indexOf(id);
        return index;
    }
    return -1;
}

async function getUsers() {
    try {
        return await readJson(filename);
    } catch (error) {
        const contents = await readJson(defaultFilename);
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

exports.get = async function (id) {
    try {
        const users = await getUsers();
        const index = await getUserIndex(users, id);
        if (index === -1) {
            return null;
        }
        return users[index];
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.delete = async function (id) {
    try {
        const users = await getUsers();
        const index = await getUserIndex(users, id);
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
        const users = await getUsers();

        if (
            users.filter((filteredUser) => {
                return filteredUser.username === user.username;
            }).length === 1
        ) {
            throw new Error(`Cannot create user with username '${user.username}' as it already exists`);
        }

        const index = await getUserIndex(users, user?.id);
        if (index !== -1) {
            // user already exists - do nothing.
            throw new Error(`Cannot create user with user id '${user.id}' as it already exists`);
        }

        // create a new user with a sparkly new UUID
        user.id = await uuidv4();
        user.enabled = false;

        // add lengths and hash password/pin
        user = await processPassword(user);

        users.push(user);
        return await writeJson(filename, users);
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.update = async function (id, user) {
    try {
        const users = await getUsers();
        const index = await getUserIndex(users, id);

        if (index !== -1) {
            user = await processPassword(user);

            users[index] = { ...users[index], ...user };
        } else {
            //User doesn't exist. Do nothing.
            return false;
        }

        return await writeJson(filename, users);
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

async function processPassword(user) {
    if (user.password !== null && user.password !== undefined) {
        user.passwordLength = user.password.length;
        user.password = await hash(user.password);
    }
    return user;
}
