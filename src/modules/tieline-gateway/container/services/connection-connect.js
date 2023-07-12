"use strict";

const tielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");

module.exports = async (connectionId) => {
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

        console.log(`connection-connect: connecting to ${connectionId}`);

        await TielineApi.post("/api/connect", {
            "cxn-id": connectionId,
        });
        return true;
    } catch (error) {
        console.log(error);
    }
};
