"use strict";

const ultrixWebApi = require("@utils/ultrix-webapi");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);
const fetchGroups = require("@utils/fetch-groups");

module.exports = async (groupName) => {

    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`group-add: failed to fetch config`);
        return false;
    }
    const path = `groupcategory/add?name=${encodeURIComponent(groupName)}&parentId=1`;
    await ultrixWebApi.get(path, config)
    await fetchGroups(config);

    return true;
};
