"use strict";

const ultrixWebApi = require("@utils/ultrix-webapi");
const configGet = require("@core/config-get");
const fetchGroups = require("@utils/fetch-groups");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");

module.exports = async (type, groupId, buttonIndexes) => {
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

    // so the easiest way to do this is to use the groupcategory api call to fetch the current 
    // list of buttons. We check if any need deleting, then add any new ones

    const typeCodes = {
        "source": 3,
        "destination": 2,
    }

    // we need to get the new button source/dest names to match against the api call
    const names = await mongoSingle.get(`${type}s`);
    const buttonNames = buttonIndexes.map((b) => {
        return names.find((n) => n.uiId === b)?.name
    });

    const response = await ultrixWebApi.get("groupcategory/agdatassds", config);
    if (response?.[0]?.Name === "GroupCategories") {
        // we know the group id
        const matchingGroup = response?.[0]?.Children.find((c) => c.Type === 1 && c.Id === groupId);
        if (!matchingGroup) {
            console.log(`group-set: invalid group id ${groupId} - not found`);
            return false;
        }

        // now find any matching nodes of this type
        const matchingNodes = matchingGroup.Children.filter((c) => c.Type === typeCodes[type]);

        // find nodes to delete
        const nodesToDelete = matchingNodes.filter((n) => !buttonNames.includes(n.Name));
        if (nodesToDelete && nodesToDelete?.length > 0) {
            const deletePath = `groupcategory/remove?ids=${nodesToDelete.map((n) => n.Id)}`;
            logger.info(`group-set: calling '${deletePath}'`);
            await ultrixWebApi.get(deletePath, config)
        }

        // and add any new ones
        const existingNames = matchingNodes.map((m) => m.Name);
        const buttonNamesToAdd = buttonNames.filter((b) => !existingNames.includes(b));
        if (buttonNamesToAdd?.length > 0) {
            const buttonIds = buttonNamesToAdd.map((b) => names.find((n) => n.name === b)?.uiId);

            // so ... even though the new firmware for ultrix defines the buttons as zero-based ... this API endpoint wants them 1-based.
            // come on Ross! At least be consistent!

            const offsetButtonIds = buttonIds.map(
                (i) => {
                    return parseInt(i) + 1
                });


            const addPath = `groupcategory/addLeaves?groupId=${groupId}&ids=${offsetButtonIds.join(",")}&type=${typeCodes[type]}`
            logger.info(`group-set: calling '${addPath}'`);
            await ultrixWebApi.get(addPath, config)
        }

        await fetchGroups(config);
        return true;
    }
};
