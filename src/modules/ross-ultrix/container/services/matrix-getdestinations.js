"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);
const matrixGetAllDestinations = require("./matrix-getalldestinations");
const matrixGetAllSources = require("./matrix-getallsources");
const mongoSingle = require("@core/mongo-single");

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
    const routesCollection = await mongoCollection("routes");

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
    const sourceNames = await matrixGetAllSources();
    const destinationNames = await matrixGetAllDestinations();
    const crosspoints = await routesCollection.find().toArray();

    if (
        Array.isArray(sourceNames) &&
        Array.isArray(destinationNames) &&
        Array.isArray(crosspoints) &&
        crosspoints.length > 0
    ) {
        for (const index in destinationNames) {
            const intIndex = parseInt(index);
            const selectedSource = crosspoints?.[intIndex]?.levels["0"];
            const selectedSourceLabel = sourceNames[selectedSource];

            const isExcluded = excludedDestinations.includes(intIndex.toString());
            const isInGroup = groupIndex === null || validDestinations.includes(intIndex);

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
                    label: destinationNames[intIndex],
                    sourceIndex: parseInt(selectedSource),
                    sourceLabel: selectedSourceLabel,
                    indexText: indexText,
                    hidden: isExcluded,
                    order: order,
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
