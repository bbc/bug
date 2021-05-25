"use strict";

// const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckWorkers = require("@core/status-checkworkers");

module.exports = async () => {
    return [].concat(
        // await statusCheckCollection("interfaces", "interface"),
        // await statusCheckCollection("traffic", "interface traffic"),
        // await statusCheckCollection("linkstats", "link statistic"),
        await statusCheckWorkers()
    );
};
