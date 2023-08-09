"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (index, type, label) => {
    if (type === "source") {
        type = "input";
    }

    if (type === "destination") {
        type = "output";
    }

    if (!["input", "output"].includes(type)) {
        logger.error(`videohub-setlabel: invalid type '${type}'`);
        return false;
    }

    if (label === "" || label === undefined || label === null) {
        label = "-";
    }

    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`videohub-setlabel: failed to fetch config`);
        return false;
    }

    try {
        const field = type == "output" ? "OUTPUT LABELS" : "INPUT LABELS";
        const command = `${index} ${label}`;

        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send(field, command);
        return true;
    } catch (error) {
        logger.error("videohub-setlabel: ", error);
        return false;
    }
};
