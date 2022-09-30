"use strict";

const tielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");

module.exports = async (connectionHandle) => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    try {
        const TielineApi = new tielineApi({
            host: config.address,
            username: config.username,
            password: config.password,
        });

        console.log(`connection-disconnect: disconnecting from ${connectionHandle}`);

        await TielineApi.get(`/api/disconnect?cxn-handle=${encodeURIComponent(connectionHandle)}`);
        return true;
    } catch (error) {
        console.log(error);
    }
};
