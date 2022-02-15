"use strict";

const logger = require("@utils/logger")(module);
const logsModel = require("@models/logs");
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}, pageNumber = 1, numberPerPage = 100) => {
    try {
        const dbFilters = {};
        if (filters["level"]) {
            dbFilters["level"] = filters["level"];
        }
        if (filters["meta"]) {
            dbFilters["meta"] = { panelId: filters["meta"] };
        }
        if (filters["message"]) {
            dbFilters["message"] = { $regex: filters["message"], $options: "i" };
        }
        if (filters["timestamp"]) {
            dbFilters["timestamp"] = { $gte: new Date(Date.now() - filters["timestamp"] * 1000) };
        }

        console.log(dbFilters);

        const logs = await logsModel.pagination(dbFilters, pageNumber, numberPerPage);

        const sortHandlerList = {
            level: sortHandlers.string,
            timestamp: sortHandlers.number,
        };

        // sort
        if (sortField && sortHandlerList[sortField]) {
            if (sortDirection === "asc") {
                logs.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
            } else {
                logs.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
            }
        }

        return logs;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to retrieve logs`);
    }
};
