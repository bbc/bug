"use strict";

const mongoSingle = require("@core/mongo-single");
const groupList = require("@services/group-list");
const configGet = require("@core/config-get");

module.exports = async (destinationIndex = null, groupIndex = 0) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`source-list: failed to fetch config`);
        return false;
    }

    // const icons = config.sourceIcons ? config.sourceIcons : [];
    // const iconColors = config.sourceIconColors ? config.sourceIconColors : [];

    const outputArray = {
        groups: [],
        sources: [],
    };

    const groups = await groupList("source");

    // add groups to output array
    groups.forEach((eachGroup, eachIndex) => {
        outputArray["groups"].push({
            ...eachGroup,
            selected: eachIndex === parseInt(groupIndex),
        });
    });

    // then calculate valid sources for this group
    const validSources = groups[groupIndex] ? groups[groupIndex]["value"] : [];

    // calculate excluded sources too
    // not that this field is an array of strings - so we call toString() on each check later on. Grrrrr.
    // const excludedSources = config["excludeSources"] ? config["excludeSources"] : [];

    // get get the existing data from the db
    const routing = await mongoSingle.get("routing");

    let selectedSourceIndex = null;
    if (destinationIndex !== null && destinationIndex > -1) {
        if (routing?.[destinationIndex]?.[1] !== -1) {
            selectedSourceIndex = routing?.[destinationIndex][1];
        }
    }

    const inputLabels = await mongoSingle.get("input_labels");
    if (inputLabels) {
        outputArray["sources"] = inputLabels
            .filter((labelItem, index) => validSources.includes(index))
            .map((labelItem) => {
                return {
                    index: labelItem[0],
                    label: labelItem[1],
                    selected: selectedSourceIndex === labelItem[0],
                    // hidden: isExcluded,
                    order: groupIndex !== null ? validSources.indexOf(labelItem[0]) : labelItem[0],
                    // icon: icons[index] ? icons[index] : null,
                    // iconColor: iconColors[intIndex] ? iconColors[intIndex] : "#ffffff",
                };
            });

        // sort by order field
        outputArray["sources"].sort((a, b) => (a.order > b.order ? 1 : -1));
    }

    return outputArray;
};
