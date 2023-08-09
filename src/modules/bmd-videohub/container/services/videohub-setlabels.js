"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (params) => {
    // params should contain a single array, with an object for each label to set:
    // { "labels: [ { "type": "output", "index": 0, "label": "Output 1" }, { ... } ] }

    if (!params.labels) {
        logger.warning(`videohub-setlabels: invalid array passed to method`);
        return false;
    }

    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`videohub-setlabels: failed to fetch config`);
        return false;
    }

    const router = new videohub({ port: config.port, host: config.address });
    await router.connect();

    for (let eachLabel of params.labels) {
        try {
            const field = eachLabel.type == "output" ? "OUTPUT LABELS" : "INPUT LABELS";
            const command = `${eachLabel.index} ${eachLabel.label}`;
            await router.send(field, command);
        } catch (error) {
            logger.error("videohub-setlabels: ", error);
            return false;
        }
    }
    return true;
};
