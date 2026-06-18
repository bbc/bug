
"use strict";

const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");

const formatMbps = (bandwidth) => {
    if (!bandwidth || Number.isNaN(Number(bandwidth))) {
        return null;
    }

    return `${Math.round((Number(bandwidth) / 100000) * 10) / 10}Mb/s`;
};

module.exports = async () => {
    try {
        const testCollection = await mongoCollection("test-results");
        const [latestResult, resultCount] = await Promise.all([
            testCollection.findOne({}, { sort: { timestamp: -1 } }),
            testCollection.countDocuments({}),
        ]);

        const latestDownload = formatMbps(latestResult?.download?.bandwidth);
        const latestUpload = formatMbps(latestResult?.upload?.bandwidth);

        let message = "Panel configured and ready";

        if (latestDownload && latestUpload) {
            message = `Last test: ${latestDownload} down, ${latestUpload} up`;
        } else if (resultCount > 0) {
            message = `${resultCount} test result(s) found`;
        }

        return new StatusItem({
            message,
            key: "defaultservice",
            type: "default",
            flags: [],
        });
    } catch (err) {
        logger.error(err.stack || err.message);
        return [];
    }
};