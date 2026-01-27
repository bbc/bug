"use strict";

const ciscoC1300SSH = require("@utils/ciscoc1300-ssh");
const configGet = require("@core/config-get");
const deviceSetPending = require("@services/device-setpending");

module.exports = async () => {
    const config = await configGet();
    console.log("device-save: saving device config ...");

    const result = await ciscoC1300SSH({
        host: config.address,
        username: config.username,
        password: config.password,
        timeout: 20000,
        commands: ["write memory"],
    });
    console.log(result);
    if (result && result.length === 1 && result[0].indexOf("Copy succeeded") > -1) {
        console.log("device-save: success");
        await deviceSetPending(false);
    } else {
        console.log("device-save: failed");
        console.log(result);
    }
};
