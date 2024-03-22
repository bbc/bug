"use strict";

const mongoSingle = require("@core/mongo-single");
const groupList = require("@services/group-list");
const configGet = require("@core/config-get");

module.exports = async (groupIndex = null, showExcluded = false) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`destination-list: failed to fetch config`);
        return false;
    }

    // const icons = config.destinationIcons ? config.destinationIcons : [];
    // const iconColors = config.destinationIconColors ? config.destinationIconColors : [];

    const outputArray = {
        groups: [],
        destinations: [],
    };

    const groups = await groupList("destination");

    // add groups to output array
    groups.forEach((eachGroup, eachIndex) => {
        outputArray["groups"].push({
            ...eachGroup,
            selected: eachIndex === parseInt(groupIndex),
        });
    });

    // then calculate valid destinations for this group
    const validDestinations = groups[groupIndex] ? groups[groupIndex]["value"] : [];

    // calculate excluded destinations too
    // not that this field is an array of strings - so we call toString() on each check later on. Grrrrr.
    // const excludedDestinations = config["excludeDestinations"] ? config["excludeDestinations"] : [];

    // get get the existing data from the db
    const outputLabels = await mongoSingle.get("output_labels");
    const inputLabels = await mongoSingle.get("input_labels");
    const routing = await mongoSingle.get("routing");

    if (outputLabels && routing && inputLabels) {
        outputArray["destinations"] = outputLabels
            .filter((labelItem, index) => validDestinations.includes(index))
            .map((labelItem) => {
                const sourceIndex = routing[labelItem[0]][1];

                return {
                    index: labelItem[0],
                    label: labelItem[1],
                    sourceIndex: sourceIndex,
                    sourceLabel: sourceIndex > -1 ? inputLabels[sourceIndex][1] : "",
                    indexText: config["showNumber"] === false ? "" : labelItem[0] + 1,
                    // hidden: isExcluded,
                    order: groupIndex !== null ? validDestinations.indexOf(labelItem[0]) : labelItem[0],
                    // isLocked: isLocalLocked || isRemoteLocked,
                    // isLocalLocked: isLocalLocked,
                    // isRemoteLocked: isRemoteLocked,
                    // icon: icons[intIndex] ? icons[intIndex] : null,
                    // iconColor: iconColors[intIndex] ? iconColors[intIndex] : "#ffffff",
                };
            });
    }

    // sort by order field
    outputArray["destinations"].sort((a, b) => (a.order > b.order ? 1 : -1));

    return outputArray;
};
