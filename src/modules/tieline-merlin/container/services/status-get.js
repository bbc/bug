"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckMongoSingle = require("@core/status-checkmongosingle");

module.exports = async () => {
    return [].concat(
        await statusCheckMongoSingle({
            collectionName: "loadedProgram",
            message: ["There is no recent information about the loaded programme."],
            itemType: "critical",
            timeoutSeconds: 1200,
            flags: ["restartPanel", "configurePanel"],
        }),
        await statusCheckCollection({
            collectionName: "programList",
            message: "Program information is out of date.",
            itemType: "warning",
            timeoutSeconds: 90,
        })
    );
};
