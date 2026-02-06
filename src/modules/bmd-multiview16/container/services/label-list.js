"use strict";

const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");
const logger = require("@utils/logger")(module);

module.exports = async () => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        const routerLabels = await mongoSingle.get("routerlabels");
        const labelsFromDb = await mongoSingle.get("input_labels");
        const labelsArray = [];

        if (labelsFromDb) {
            for (const [key, value] of Object.entries(labelsFromDb)) {
                const autoLabelIndex = config.autoLabelIndex?.[key] ?? "";

                labelsArray.push({
                    inputIndex: parseInt(key),
                    input: (parseInt(key) + 1).toString(),
                    label: value,
                    autoLabel: routerLabels?.[autoLabelIndex]?.inputLabel ?? "",
                    autoLabelIndex: autoLabelIndex,
                    autoLabelEnabled: config.autoLabelEnabled?.includes(parseInt(key)) ?? false,
                });
            }
        }

        return labelsArray;

    } catch (err) {
        err.message = `label-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
