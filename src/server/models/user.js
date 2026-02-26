"use strict";

const logger = require("@core/logger")(module);
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const hash = require("@utils/hash");

const filename = path.join(__dirname, "..", "..", "..", "config", "global", "users.json");
const defaultFilename = path.join(__dirname, "..", "..", "..", "config", "default", "users.json");

async function getUserIndex(users, id) {
    if (users && id) {
        return users.map(u => u?.id).indexOf(id);
    }
    return -1;
}

async function getUsers() {
    try {
        return await readJson(filename);
    } catch (err) {
        try {
            const contents = await readJson(defaultFilename);
            await writeJson(filename, contents);
            return contents;
        } catch (writeErr) {
            writeErr.message = `getUsers: ${writeErr.message}`;
            logger.error(writeErr.stack || writeErr.message);
            throw writeErr;
        }
    }
}

async function processPassword(user) {
    if (user.password !== null && user.password !== undefined) {
        user.passwordLength = user.password.length;
        user.password = await hash(user.password);
    }
    return user;
}

exports.list = async function () {
    try {
        return await getUsers();
    } catch (err) {
        err.message = `users-list: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.get = async function (id) {
    try {
        const users = await getUsers();
        const index = await getUserIndex(users, id);
        if (index === -1) return null;
        return users[index];
    } catch (err) {
        err.message = `users-get: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.delete = async function (id) {
    try {
        const users = await getUsers();
        const index = await getUserIndex(users, id);
        if (index === -1) return null;
        users.splice(index, 1);
        return await writeJson(filename, users);
    } catch (err) {
        err.message = `users-delete: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.set = async function (user) {
    try {
        const users = await getUsers();

        if (users.some(u => u.username === user.username)) {
            throw new Error(`Cannot create user with username '${user.username}' as it already exists`);
        }

        const index = await getUserIndex(users, user?.id);
        if (index !== -1) {
            throw new Error(`Cannot create user with user id '${user.id}' as it already exists`);
        }

        user.id = await uuidv4();
        user = await processPassword(user);

        users.push(user);
        return await writeJson(filename, users);
    } catch (err) {
        err.message = `users-set: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.update = async function (id, user) {
    try {
        const users = await getUsers();
        const index = await getUserIndex(users, id);

        if (index === -1) return false;

        user = await processPassword(user);
        users[index] = { ...users[index], ...user };

        return await writeJson(filename, users);
    } catch (err) {
        err.message = `users-update: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};