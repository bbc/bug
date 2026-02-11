"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const configGet = require("@core/config-get");

module.exports = async () => {
    const config = await configGet();

    const tracerouteResult = await statusCheckCollection({
        collectionName: "traceroute",
        message: ["There is no traceroute information.", "Check your connection and authentication settings."],
        itemType: "critical",
        timeoutSeconds: 120,
        flags: ["restartPanel", "configurePanel"],
    });
    if (tracerouteResult.length > 0) {
        return tracerouteResult;
    }

    return [].concat(
        await statusCheckCollection({
            collectionName: "traceroute",
            message: "Traceroute information is outdated.",
            itemType: "warning",
            timeoutSeconds: config?.frequency + 10,
        })
    );
};
