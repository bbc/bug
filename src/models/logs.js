"use strict";

const logger = require("@utils/logger")(module);
const mongoCollection = require("@core/mongo-collection");

exports.get = async function (filter) {
    try {
        const logsCollection = await mongoCollection("logs");

        if (logsCollection) {
            const result = await logsCollection.find(filter).toArray();
            if (result) {
                return result;
            }
        }
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.pagination = async function (filter, pageNumber, nPerPage) {
    try {
        const logsCollection = await mongoCollection("logs");

        if (logsCollection) {
            const result = await logsCollection
                .find(filter)
                .sort({ _id: 1 })
                .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
                .limit(nPerPage)
                .toArray();
            if (result) {
                return result;
            }
        }
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};
