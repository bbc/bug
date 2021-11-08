"use strict";

const ciscoSGSSH = require("@utils/ciscosg-ssh");
const configGet = require("@core/config-get");

module.exports = async () => {
    const config = await configGet();
    const result = await ciscoSGSSH({
        host: config.address,
        username: config.username,
        password: config.password,
        timeout: 10000,
        commands: ["write memory"],
    });
    return result && result.length === 1 && result[0].indexOf("Copy succeeded") > -1;
};
