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
        logger.error(`groups-list: failed to fetch config`);
        return false;
    }

    const status = await mongoSingle.get("status");

    const modules = [];

    for (let moduleIndex = 0; moduleIndex < 6; moduleIndex++) {
        const moduleType = status?.module_type?.[moduleIndex];
        const net = status?.net?.[moduleIndex];

        modules.push({
            index: moduleIndex,
            deviceTypeId: moduleType?.id,
            deviceType: moduleType?.name,
            title: `Network ${moduleIndex + 1}`,
            fw_version: net?.fw_version,
            lock: net?.lock,
            online: net?.online,
            stable: net?.stable,
            sync: net?.sync,
        });
    }

    for (let madiIndex = 0; madiIndex < 2; madiIndex++) {
        const madi = status?.madi?.[madiIndex];
        modules.push({
            index: madiIndex + 6,
            deviceTypeId: null,
            deviceType: "MADI",
            title: `MADI ${madiIndex + 1}`,
            fw_version: "N/A",
            lock: madi?.lock,
            online: true,
            stable: madi?.stable,
            sync: madi?.sync,
        });
    }

    return modules;
};
