"use strict";

const ciscoC1300SSH = require("@utils/ciscoc1300-ssh");
const configGet = require("@core/config-get");
const deviceSetPending = require("@services/device-setpending");

module.exports = async () => {
    let config;
    let result;

    try {
        config = await configGet();
    } catch (err) {
        err.message = `device-save: failed to load config: ${err.message}`;
        throw err;
    }

    console.log("device-save: saving device config ...");

    try {
        result = await ciscoC1300SSH({
            host: config.address,
            username: config.username,
            password: config.password,
            timeout: 20000,
            commands: ["write memory"],
        });
    } catch (err) {
        err.message = `device-save: SSH command failed: ${err.message}`;
        throw err;
    }

    const success =
        Array.isArray(result) &&
        result.length === 1 &&
        typeof result[0] === "string" &&
        result[0].includes("Copy succeeded");

    if (!success) {
        throw new Error(
            `device-save: device did not confirm save (response: ${JSON.stringify(result)})`
        );
    }

    console.log("device-save: success");

    try {
        await deviceSetPending(false);
    } catch (err) {
        err.message = `device-save: saved but failed to clear pending flag: ${err.message}`;
        throw err;
    }
};
