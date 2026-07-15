"use strict";

const configGet = require("@core/config-get");
const statusCheckMongoSingle = require("@core/status-checkmongosingle");

module.exports = async () => {
    const config = await configGet();

    if (!config?.codecSource) {
        return [];
    }

    return statusCheckMongoSingle({
        collectionName: "codecdb",
        message: ["Codec database is empty"],
        itemType: "warning",
        timeoutSeconds: 60,
    });
};
