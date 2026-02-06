"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (index, type, label) => {
    try {
        // normalize type
        if (type === "source") type = "input";
        if (type === "destination") type = "output";

        // validate type
        if (!["input", "output"].includes(type)) {
            throw new Error(`invalid type '${type}'`);
        }

        // default empty label
        if (label === "" || label === undefined || label === null) {
            label = "-";
        }

        // fetch config
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        // validate index
        if (index === undefined || index === null || isNaN(index)) {
            throw new Error("invalid index provided");
        }

        // determine field and command
        const field = type === "output" ? "OUTPUT LABELS" : "INPUT LABELS";
        const command = `${index} ${label}`;

        // connect to videohub router
        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();

        // send label command
        await router.send(field, command, true);

        logger.info(`videohub-setlabel: set ${type} label '${label}' for index ${index}`);
        return true;

    } catch (err) {
        err.message = `videohub-setlabel: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
