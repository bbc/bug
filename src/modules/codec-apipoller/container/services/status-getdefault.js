"use strict";

const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en.json");

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-GB");

module.exports = async () => {
    try {
        const codecs = await mongoSingle.get("codecs");
        const codecsStatus = await mongoSingle.get("codecsStatus");
        const lastUpdated = codecsStatus?.lastUpdated
            ? timeAgo.format(new Date(codecsStatus.lastUpdated))
            : "never";

        return new StatusItem({
            message: `Module active with ${Array.isArray(codecs) ? codecs.length : 0} codec record(s), updated ${lastUpdated}`,
            key: "defaultservice",
            type: "default",
            flags: [],
        });
    } catch (err) {
        logger.error(err.stack || err.message);
        return [];
    }
};