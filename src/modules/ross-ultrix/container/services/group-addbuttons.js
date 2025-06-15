"use strict";

const ultrixWebApi = require("@utils/ultrix-webapi");
const configGet = require("@core/config-get");
const fetchGroups = require("@utils/fetch-groups");
const logger = require("@core/logger")(module);

module.exports = async (type, groupIds, buttonIndexes) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`group-rename: failed to fetch config`);
        return false;
    }

    const typeCodes = {
        "source": 3,
        "destination": 2,
    }

    // so ... even though the new firmware for ultrix defines the buttons as zero-based ... this API endpoint wants them 1-based.
    // come on Ross! At least be consistent!

    const offsetIndexes = buttonIndexes.map(
        (i) => {
            return parseInt(i) + 1
        });

    for (let eachGroupId of groupIds) {
        const path = `groupcategory/addLeaves?groupId=${eachGroupId}&ids=${offsetIndexes.join(",")}&type=${typeCodes[type]}`
        logger.info(`group-addbuttons: calling '${path}'`);
        await ultrixWebApi.get(path, config)
    }
    await fetchGroups(config);
};
