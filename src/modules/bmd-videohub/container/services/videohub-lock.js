"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");

module.exports = async (index) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`videohub-lock: failed to fetch config`);
        return false;
    }

    try {
        const field = "VIDEO OUTPUT LOCKS";
        const command = `${index} O`;

        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send(field, command);
        return true;
    } catch (error) {
        console.log("videohub-lock: ", error);
        return false;
    }
};
