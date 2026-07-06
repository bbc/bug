"use strict";

const codecdataGet = require("@services/codecdata-get");
const localdataSet = require("@services/localdata-set");

module.exports = async (outputIndex) => {
    const codecData = await codecdataGet();
    const streamServers = Array.isArray(codecData?.["stream-server"]) ? [...codecData["stream-server"]] : [];
    const index = Number.parseInt(outputIndex, 10);

    if (!Number.isInteger(index) || index < 0 || index >= streamServers.length || streamServers.length === 1) {
        return false;
    }

    streamServers.splice(index, 1);

    return await localdataSet({
        "stream-server": streamServers,
    });
};