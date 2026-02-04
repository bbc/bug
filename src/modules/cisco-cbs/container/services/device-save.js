"use strict";

const ciscoCBSSSH = require("@utils/ciscocbs-ssh");
const configGet = require("@core/config-get");

module.exports = async () => {
    try {
        // load config
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        const { address, username, password } = config;

        if (!address || !username || !password) {
            throw new Error("invalid config: missing address, username, or password");
        }

        console.log("device-save: saving device config ...");

        // prepare commands safely
        const commands = ["write memory"];

        // run cisco ssh
        const result = await ciscoCBSSSH({
            host: address,
            username,
            password,
            timeout: 20000,
            commands: commands.slice(), // safely extend array if needed
        });

        console.log("device-save: ssh result ->", result);

        // check result safely
        const resultArray = Array.isArray(result) ? result : [];
        if (resultArray.length === 1 && resultArray[0]?.includes("Copy succeeded")) {
            console.log("device-save: success");
        } else {
            console.error("device-save: failed");
            console.error(resultArray);
            throw new Error("device save failed: unexpected ssh result");
        }

    } catch (err) {
        console.error("device-save: ", err);
        throw err;
    }
};
