"use strict";

const tielineApi = require("@utils/tieline-api");
const configGet = require("@core/config-get");

module.exports = async (groupId) => {
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

        console.log(`group-connect: connecting to ${groupId}`);

        await TielineApi.post("/api/disconnect", {
            "group-id": groupId,
        });
        return true;
    } catch (error) {
        console.log(error);
    }
};
