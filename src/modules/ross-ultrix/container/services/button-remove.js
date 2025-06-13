"use strict";

const ultrixWebApi = require("@utils/ultrix-webapi");
const configGet = require("@core/config-get");
const fetchGroups = require("@utils/fetch-groups");
const logger = require("@core/logger")(module);

module.exports = async (type, groupId, name) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`button-remove: failed to fetch config`);
        return false;
    }

    // so there's no easy way to do this because we don't store the actual node ID from the 
    // groupcategory api call. So - we'll call it again and search for the (luckily unique) name

    const typeCodes = {
        "source": 3,
        "destination": 2,
    }


    const response = await ultrixWebApi.get("groupcategory/agdatassds", config);
    if (response?.[0]?.Name === "GroupCategories") {
        // we know the group id
        const matchingGroup = response?.[0]?.Children.find((c) => c.Type === 1 && c.Id === groupId);
        if (!matchingGroup) {
            console.log(`button-remove: invalid group id ${groupId} - not found`);
            return false;
        }

        // now find the matching node
        const matchingNode = matchingGroup.Children.find((c) => c.Type === typeCodes[type] && c.Name === name);
        if (!matchingNode) {
            console.log(`button-remove: invalid label '${name}' - not found in group id ${groupId}`);
            return false;
        }

        // now we can delete it
        const path = `groupcategory/remove?ids=${matchingNode.Id}`
        logger.info(`button-remove: calling '${path}'`);
        await ultrixWebApi.get(path, config)
        await fetchGroups(config);
    }
};
