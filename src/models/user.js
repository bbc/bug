"use strict";

const logger = require("@utils/logger")(module);
const mongoCollection = require("@core/mongo-collection");

exports.list = async function () {
    try {
        const usersCollection = await mongoCollection("users");
        const result = await usersCollection.find().toArray();
        return result;
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.get = async function (email) {
    try {
        const usersCollection = await mongoCollection("users");
        const result = await usersCollection.findOne({ email: email });
        return result;
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.delete = async function (email) {
    try {
        const usersCollection = await mongoCollection("users");
        const result = await usersCollection.deleteOne({ email: email });
        return result;
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.set = async function (user) {
    try {
        const usersCollection = await mongoCollection("users");

        const query = { email: user?.email };
        const update = {
            $set: { ...user },
        };
        const options = { upsert: true };
        const result = await usersCollection.updateOne(query, update, options);

        return result;
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};
