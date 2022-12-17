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

exports.pagination = async function (
    filter = {},
    sort = { feild: "timestamp", direction: "asc" },
    pageNumber = 1,
    nPerPage = 25
) {
    try {
        const logsCollection = await mongoCollection("logs");

        const sortObject = {};
        sortObject[sort.feild] = sort.direction === "asc" ? 1 : -1;

        if (logsCollection) {
            const result = await logsCollection
                .find(filter)
                .sort(sortObject)
                .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
                .limit(parseInt(nPerPage))
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
