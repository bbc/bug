"use strict";

const ultrixWebApi = require("@utils/ultrix-webapi");
const configGet = require("@core/config-get");
const fetchGroups = require("@utils/fetch-groups");
const logger = require("@core/logger")(module);

module.exports = async (groupId, newGroupName) => {
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

    if (!newGroupName) {
        return false;
    }

    const path = `groupcategory/rename?name=${newGroupName}&id=${groupId}`
    logger.info(`group-rename: calling '${path}'`);
    await ultrixWebApi.get(path, config)
    await fetchGroups(config);
};
