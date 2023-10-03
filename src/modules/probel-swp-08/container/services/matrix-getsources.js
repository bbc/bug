"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (destinationIndex = null, groupIndex = null, showExcluded = false) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`matrix-getsources: failed to fetch config`);
        return false;
    }

    const icons = config.sourceIcons ? config.sourceIcons : [];
    const iconColors = config.sourceIconColors ? config.sourceIconColors : [];

    const dataCollection = await mongoCollection("data");

    const outputArray = {
        groups: [],
        sources: [],
    };

    // add groups first
    groupIndex = groupIndex < 0 ? null : groupIndex;

    const groups = config["sourceGroups"] ?? [];
    if (groups.length > 0 && groupIndex === null) {
        groupIndex = 0;
    }
    if (groups.length === 0) {
        groupIndex = null;
    }

    // add groups to output array
    groups.forEach((eachGroup, eachIndex) => {
        outputArray["groups"].push({
            label: eachGroup["name"],
            selected: eachIndex === parseInt(groupIndex),
            index: eachIndex,
        });
    });

    // then calculate valid sources for this group
    const validSources = groups[groupIndex] ? groups[groupIndex]["value"] : [];

    // calculate excluded sources too
    // not that this field is an array of strings - so we call toString() on each check later on. Grrrrr.
    const excludedSources = config["excludeSources"] ? config["excludeSources"] : [];

    // get get the existing data from the db
    const crosspoints = await dataCollection.find().toArray();
    let selectedSourceIndex = null;

    for (let item of crosspoints) {
        if (parseInt(item?.destination) - 1 === destinationIndex) {
            selectedSourceIndex = parseInt(item.levels["1"]);
        }
    }

    const sourceNames = config?.sourceNames;

    if (Array.isArray(sourceNames)) {
        for (let index in sourceNames) {
            const sourceName = sourceNames[index];
            const intIndex = parseInt(index);

            // check it's not excluded or if it's a selected source - in which case we'll show it anyway
            const isExcluded = excludedSources.includes(index.toString());
            const isSelected = selectedSourceIndex === intIndex;
            const isInGroup = groupIndex === null || validSources.includes(intIndex);

            // set new order field - if in group then use the validsources index, otherwise the normal one
            let order;
            if (groupIndex !== null) {
                order = validSources.indexOf(intIndex);
            } else {
                order = intIndex;
            }

            if (isInGroup && (!isExcluded || showExcluded)) {
                outputArray["sources"].push({
                    index: intIndex,
                    label: sourceName,
                    selected: isSelected,
                    hidden: isExcluded,
                    order: order,
                    icon: icons[intIndex] ? icons[intIndex] : null,
                    iconColor: iconColors[intIndex] ? iconColors[intIndex] : "#ffffff",
                });
            }
        }

        // sort by order field
        outputArray["sources"].sort((a, b) => (a.order > b.order ? 1 : -1));
    }

    return outputArray;
};
