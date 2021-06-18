"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckWorkers = require("@core/status-checkworkers");
const StatusItem = require("@core/StatusItem");

module.exports = async () => {
    const testStatus = [
        // new StatusItem({
        //     key: `geofftest1`,
        //     message: `This is an error of some sort - no idea what`,
        //     type: `error`,
        // }),
        // new StatusItem({
        //     key: `geofftest2`,
        //     message: `This is a warning of some sort - no idea what`,
        //     type: `warning`,
        // }),
        // new StatusItem({
        //     key: `geofftest3`,
        //     message: `This is an info of some sort - no idea what`,
        //     type: `info`,
        // }),
    ];

    return [].concat(
        await statusCheckCollection("interfaces", "interface"),
        await statusCheckCollection("traffic", "interface traffic"),
        await statusCheckCollection("linkstats", "link statistic"),
        await statusCheckCollection("workers", "worker status"),
        testStatus
    );
};
