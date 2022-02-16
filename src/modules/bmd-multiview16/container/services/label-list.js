"use strict";

const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");

module.exports = async () => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`label-list: failed to fetch config`);
        return false;
    }

    const labelsFromDb = await mongoSingle.get("input_labels");
    const labelsArray = [];
    if (labelsFromDb) {
        for (const [key, value] of Object.entries(labelsFromDb)) {
            labelsArray.push({
                inputIndex: parseInt(key),
                input: (parseInt(key) + 1).toString(),
                label: value,
                autoLabel: `Auto Label ${key}`,
                autoLabelIndex: config?.autoLabelIndex?.[key] ?? -1,
                autoLabelEnabled: config?.autoLabelEnabled?.includes(parseInt(key)),
            });
        }
    }
    return labelsArray;
};
