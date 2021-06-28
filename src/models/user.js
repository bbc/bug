"use strict";

const logger = require("@utils/logger")(module);
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const hash = require("@utils/hash");

const filename = path.join(__dirname, "..", "config", "global", "users.json");

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
        const index = await getUserIndex(users, user?.id);
        if (index !== -1) {
            // user already exists - do nothing.
            return false;
        } else {
            // create a new user with a sparkly new UUID
            user.id = await uuidv4();
            user.enabled = false;

            // add lengths and hash password/pin
            console.log(user);
            user = await processPasswords(user);
            console.log(user);
            users.push(user);
            return await writeJson(filename, users);
        }
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
            user = await processPasswords(user);

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

async function processPasswords(user) {
    if (user.password !== null && user.password !== undefined) {
        user.passwordLength = user.password.length;
        user.password = await hash(user.password);
    }
    if (user.pin !== null && user.pin !== undefined) {
        user.pinLength = user.pin.length;
        user.pin = await hash(user.pin);
    }

    return user;
}
