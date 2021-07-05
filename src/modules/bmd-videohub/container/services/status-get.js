"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckWorkers = require("@core/status-checkworkers");

module.exports = async () => {
    // const seconds = new Date().getTime() / 1000;
    // const a = Math.round(seconds / 6);
    // if (a % 2 == 0) {
    return [].concat(
        await statusCheckCollection({
            collectionName: "data",
            message: ["There is no recent router data for this device.", "Check your connection or address details."],
            itemType: "critical",
            timeoutSeconds: 15,
            flags: ["restartPanel", "configurePanel"],
        })
    );
    // } else {
    //     return [].concat(
    //         await statusCheckCollection({
    //             collectionName: "data",
    //             message: "There is no recent router data for this device.\nCheck your connection or address details.",
    //             itemType: "critical",
    //             timeoutSeconds: 10,
    //             flags: ["restartPanel", "configurePanel"],
    //         })
    //     );
    // }
};
