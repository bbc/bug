"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);
const cacheResponse = require("@utils/videohub-cache-response");

module.exports = async (params) => {
    let router = null;
    try {
        // params should contain a single array, with an object for each label to set:
        // { "labels": [ { "type": "output", "index": 0, "label": "Output 1" }, { ... } ] }

        // validate labels array
        if (!params?.labels || !Array.isArray(params.labels)) {
            throw new Error("invalid array passed to method");
        }

        // fetch config
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        // connect to videohub router
        router = new videohub({ port: config.port, host: config.address });
        await router.connect();

        // loop through each label and send command
        for (let eachLabel of params.labels) {
            try {
                const { type, index, label } = eachLabel;

                // validate label object
                if (!["input", "output"].includes(type) && !["source", "destination"].includes(type)) {
                    throw new Error(`invalid type '${type}'`);
                }
                if (index === undefined || index === null || isNaN(index)) {
                    throw new Error("invalid index provided");
                }

                // normalize type
                const normalizedType = type === "source" ? "input" : type === "destination" ? "output" : type;
                const field = normalizedType === "output" ? "OUTPUT LABELS" : "INPUT LABELS";

                // default empty label
                const labelValue = label ?? "-";
                const command = `${index} ${labelValue}`;

                // send command
                await router.send(field, command);

                logger.info(`set ${normalizedType} label '${labelValue}' for index ${index}`);
            } catch (err) {
                logger.error(`${err.stack || err.message}`);
                throw err;
            }
        }

        // Verify labels were set by querying back
        const response = await router.query("OUTPUT LABELS");
        if (!response) {
            throw new Error("Failed to verify label settings");
        }

        await cacheResponse(response);

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
