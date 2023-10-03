"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (groupIndex = null, showExcluded = false) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`matrix-getdestinations: failed to fetch config`);
        return false;
    }

    const icons = config.destinationIcons ? config.destinationIcons : [];
    const iconColors = config.destinationIconColors ? config.destinationIconColors : [];

    const dataCollection = await mongoCollection("data");

    const outputArray = {
        groups: [],
        destinations: [],
    };

    // add groups first
    groupIndex = groupIndex < 0 ? null : groupIndex;

    const groups = config["destinationGroups"] ?? [];
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
    const validDestinations = groups[groupIndex] ? groups[groupIndex]["value"] : [];

    // calculate excluded sources too
    // not that this field is an array of strings - so we call toString() on each check later on. Grrrrr.
    const excludedDestinations = config["excludeDestinations"] ? config["excludeDestinations"] : [];

    // get get the existing data from the db

    const sourceNames = config?.sourceNames;
    const destinationNames = config?.destinationNames;
    const crosspoints = await dataCollection.find().toArray();

    if (
        Array.isArray(sourceNames) &&
        Array.isArray(destinationNames) &&
        Array.isArray(crosspoints) &&
        crosspoints.length > 0
    ) {
        for (const index in destinationNames) {
            const selectedSource = parseInt(crosspoints[index].levels["1"]) - 1;
            const selectedSourceLabel = sourceNames[selectedSource];

            const isExcluded = excludedDestinations.includes(index.toString());
            const isInGroup = groupIndex === null || validDestinations.includes(index);

            let isLocalLocked = false;
            let isRemoteLocked = false;

            // if (dbOutputLocks && dbOutputLocks["data"][eachIndex]) {
            //     isLocalLocked = dbOutputLocks["data"][eachIndex] == "O";
            //     isRemoteLocked = dbOutputLocks["data"][eachIndex] == "L";
            // }

            const indexText = config["showNumber"] === false ? "" : index + 1;

            // set new order field - if in group then use the validsources index, otherwise the normal one
            let order;
            if (groupIndex !== null) {
                order = validDestinations.indexOf(index);
            } else {
                order = index;
            }

            if (isInGroup && (!isExcluded || showExcluded)) {
                outputArray["destinations"].push({
                    index: index,
                    label: destinationNames[index],
                    sourceIndex: parseInt(selectedSource),
                    sourceLabel: selectedSourceLabel,
                    indexText: indexText,
                    hidden: isExcluded,
                    order: order,
                    isLocked: isLocalLocked || isRemoteLocked,
                    isLocalLocked: isLocalLocked,
                    isRemoteLocked: isRemoteLocked,
                    icon: icons[index] ? icons[index] : null,
                    iconColor: iconColors[index] ? iconColors[index] : "#ffffff",
                });
            }
        }

        // sort by order field
        outputArray["destinations"].sort((a, b) => (a.order > b.order ? 1 : -1));
    }
    return outputArray;
};
