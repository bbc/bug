"use strict";

const configGet = require("@core/config-get");
const aristaApi = require("@utils/arista-api");

module.exports = async () => {
    const config = await configGet();
    console.log("device-save: saving device config ...");

    await aristaApi({
        host: config.address,
        protocol: "https",
        port: 443,
        username: config.username,
        password: config.password,
        commands: ["enable", "write memory"],
    });

    console.log("device-save: success");
};
