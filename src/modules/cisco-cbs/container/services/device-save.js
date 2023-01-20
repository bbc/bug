"use strict";

const ciscoCBSSSH = require("@utils/ciscocbs-ssh");
const configGet = require("@core/config-get");

module.exports = async () => {
    const config = await configGet();
    console.log("device-save: saving device config ...");

    const result = await ciscoCBSSSH({
        host: config.address,
        username: config.username,
        password: config.password,
        timeout: 20000,
        commands: ["write memory"],
    });
    console.log(result);
    if (result && result.length === 1 && result[0].indexOf("Copy succeeded") > -1) {
        console.log("device-save: success");
    } else {
        console.log("device-save: failed");
        console.log(result);
    }
};
