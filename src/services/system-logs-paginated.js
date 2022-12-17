"use strict";

const logger = require("@utils/logger")(module);
const logsModel = require("@models/logs");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}, pageNumber = 1, numberPerPage = 100) => {
    try {
        const dbFilters = {};
        if (filters["level"]) {
            dbFilters["level"] = filters["level"];
        }
        if (filters["panelId"]) {
            dbFilters["meta.panelId"] = filters["panelId"];
        }
        if (filters["userId"]) {
            dbFilters["meta.userId"] = filters["userId"];
        }
        if (filters["filename"]) {
            dbFilters["meta.filename"] = filters["filename"];
        }
        if (filters["message"]) {
            dbFilters["message"] = { $regex: filters["message"], $options: "i" };
        }
        if (filters["timestamp"]) {
            dbFilters["timestamp"] = { $gte: new Date(Date.now() - filters["timestamp"] * 1000) };
        }

        const logs = await logsModel.pagination(
            dbFilters,
            { feild: sortField, direction: sortDirection },
            pageNumber,
            numberPerPage
        );

        return logs;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to retrieve logs`);
    }
};
