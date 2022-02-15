"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");

module.exports = async (name, value) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`output-route: failed to fetch config`);
        return false;
    }

    try {
        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send("CONFIGURATION", `${name}: ${value}`);
        return true;
    } catch (error) {
        console.log("deviceconfig-set: ", error);
        return false;
    }
};
