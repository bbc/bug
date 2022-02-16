"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");

module.exports = async (inputIndex, label) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`label-set: failed to fetch config`);
        return false;
    }

    try {
        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send("INPUT LABELS", `${inputIndex} ${label}`, true);
        return true;
    } catch (error) {
        console.log("label-set: ", error);
        return false;
    }
};
