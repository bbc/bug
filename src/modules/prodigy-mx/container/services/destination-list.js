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

    const icons = config.destinationIcons ? config.destinationIcons : [];
    const iconColors = config.destinationIconColors ? config.destinationIconColors : [];

    const outputArray = {
        groups: [],
        destinations: [],
    };

    const groups = await groupList("destination");

    // add groups to output array
    outputArray["groups"] = groups.map((eachGroup, eachIndex) => {
        // we only need a subset of the fields - eg we don't need the huge value array
        return {
            label: eachGroup.label,
            index: eachGroup.index,
            fixed: eachGroup.fixed,
            selected: eachIndex === groupIndex,
        };
    });

    const buttonsFixed = groups.find((group, index) => index === groupIndex)?.fixed ?? false;

    // then calculate valid destinations for this group
    const validDestinations = groups[groupIndex] ? groups[groupIndex]["value"] : [];

    // get get the existing data from the db
    const outputLabels = await mongoSingle.get("output_labels");
    const inputLabels = await mongoSingle.get("input_labels");
    const routing = await mongoSingle.get("routing");

    if (outputLabels && routing && inputLabels) {
        outputArray["destinations"] = outputLabels
            .filter((labelItem, index) => validDestinations.includes(index))
            .map((labelItem) => {
                const sourceIndex = routing[labelItem[0]][1];
                const labelIndex = labelItem[0];
                return {
                    index: labelIndex,
                    label: labelItem[1],
                    fixed: buttonsFixed,
                    sourceIndex: sourceIndex,
                    sourceLabel: sourceIndex > -1 ? inputLabels[sourceIndex][1] : "",
                    indexText: config["showNumber"] === false ? "" : labelIndex + 1,
                    order: groupIndex !== null ? validDestinations.indexOf(labelIndex) : labelIndex,
                    icon: icons[labelIndex] ? icons[labelIndex] : null,
                    iconColor: iconColors[labelIndex] ? iconColors[labelIndex] : "#ffffff",
                };
            });
    }

    // sort by order field
    outputArray["destinations"].sort((a, b) => (a.order > b.order ? 1 : -1));

    return outputArray;
};
