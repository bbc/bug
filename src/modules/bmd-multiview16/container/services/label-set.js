"use strict";

const configGet = require("@core/config-get");
const Videohub = require("@utils/videohub-promise");
const logger = require("@utils/logger")(module);

module.exports = async (inputIndex, label) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        const router = new Videohub({ host: config.address, port: config.port });
        await router.connect();
        await router.send("INPUT LABELS", `${inputIndex} ${label}`, true);

        return true;

    } catch (err) {
        err.message = `label-set: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
