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
        logger.error(`videohub-getdestinations: failed to fetch config`);
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
    const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
    const dbOutputRouting = await dataCollection.findOne({ title: "video_output_routing" });
    const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
    const dbOutputLocks = await dataCollection.findOne({ title: "video_output_locks" });

    if (dbOutputLabels && dbOutputRouting && dbInputLabels) {
        for (const [eachIndex, eachValue] of Object.entries(dbOutputLabels["data"])) {
            const intIndex = parseInt(eachIndex);
            const selectedSource = dbOutputRouting["data"][eachIndex];
            const selectedSourceLabel = dbInputLabels.data[selectedSource];
            const isExcluded = excludedDestinations.includes(intIndex.toString());
            const isInGroup = groupIndex === null || validDestinations.includes(intIndex);

            let isLocalLocked = false;
            let isRemoteLocked = false;

            if (dbOutputLocks && dbOutputLocks["data"][eachIndex]) {
                isLocalLocked = dbOutputLocks["data"][eachIndex] == "O";
                isRemoteLocked = dbOutputLocks["data"][eachIndex] == "L";
            }

            const indexText = config["showNumber"] === false ? "" : intIndex + 1;

            // set new order field - if in group then use the validsources index, otherwise the normal one
            let order;
            if (groupIndex !== null) {
                order = validDestinations.indexOf(intIndex);
            } else {
                order = intIndex;
            }

            if (isInGroup && (!isExcluded || showExcluded)) {
                outputArray["destinations"].push({
                    index: intIndex,
                    label: eachValue,
                    sourceIndex: parseInt(selectedSource),
                    sourceLabel: selectedSourceLabel,
                    indexText: indexText,
                    hidden: isExcluded,
                    order: order,
                    isLocked: isLocalLocked || isRemoteLocked,
                    isLocalLocked: isLocalLocked,
                    isRemoteLocked: isRemoteLocked,
                    icon: icons[intIndex] ? icons[intIndex] : null,
                    iconColor: iconColors[intIndex] ? iconColors[intIndex] : "#ffffff",
                });
            }
        }

        // sort by order field
        outputArray["destinations"].sort((a, b) => (a.order > b.order ? 1 : -1));
    }
    return outputArray;
};
