"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (index, type, label) => {
    let router = null;
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
        router = new videohub({ port: config.port, host: config.address });
        await router.connect();

        // send label command
        await router.send(field, command);

        // Verify the label was set by querying back
        const response = await router.query(field);
        if (!response || !response.data[index]) {
            throw new Error("Failed to verify label setting");
        }

        logger.info(`set ${type} label '${label}' for index ${index}`);
        return true;
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    } finally {
        if (router) {
            await router.disconnect();
        }
    }
};
