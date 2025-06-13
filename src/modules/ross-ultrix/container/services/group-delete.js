"use strict";

const ultrixWebApi = require("@utils/ultrix-webapi");
const configGet = require("@core/config-get");
const fetchGroups = require("@utils/fetch-groups");
const logger = require("@core/logger")(module);

module.exports = async (groupId) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`group-delete: failed to fetch config`);
        return false;
    }


    const path = `groupcategory/remove?ids=${encodeURIComponent(groupId)}`;
    logger.info(`group-delete: calling '${path}'`);
    await ultrixWebApi.get(path, config)
    await fetchGroups(config);

    return true;
};
