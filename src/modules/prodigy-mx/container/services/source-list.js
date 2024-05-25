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

    const icons = config.sourceIcons ? config.sourceIcons : [];
    const iconColors = config.sourceIconColors ? config.sourceIconColors : [];

    const outputArray = {
        groups: [],
        sources: [],
    };

    const groups = await groupList("source");

    // add groups to output array
    outputArray["groups"] = groups.map((eachGroup, eachIndex) => {
        // we only need a subset of the fields - eg we don't need the huge value array
        return {
            label: eachGroup.label,
            index: eachGroup.index,
            fixed: eachGroup.fixed,
            selected: eachIndex === parseInt(groupIndex),
        };
    });

    const buttonsFixed = groups.find((group, index) => index === groupIndex)?.fixed ?? false;

    // then calculate valid sources for this group
    const validSources = groups[groupIndex] ? groups[groupIndex]["value"] : [];

    // get get the existing data from the db
    const routing = await mongoSingle.get("routing");

    let selectedSourceIndex = null;
    if (destinationIndex !== null && destinationIndex > -1) {
        selectedSourceIndex = routing?.[destinationIndex][1];
    }

    const inputLabels = await mongoSingle.get("input_labels");

    if (inputLabels) {
        outputArray["sources"] = inputLabels
            .filter((labelItem, index) => validSources.includes(index))
            .map((labelItem) => {
                const labelIndex = labelItem[0];
                return {
                    index: labelIndex,
                    label: labelItem[1],
                    fixed: buttonsFixed,
                    selected: selectedSourceIndex === labelIndex,
                    order: groupIndex !== null ? validSources.indexOf(labelIndex) : labelIndex,
                    icon: icons[labelIndex] ? icons[labelIndex] : null,
                    iconColor: iconColors[labelIndex] ? iconColors[labelIndex] : "#ffffff",
                };
            });

        // add a park source
        outputArray["sources"].unshift({
            index: -1,
            label: "Park",
            fixed: true,
            selected: selectedSourceIndex === -1,
            order: -1,
            icon: "mdi-car-brake-parking",
            iconColor: null,
        });
        // sort by order field
        outputArray["sources"].sort((a, b) => (a.order > b.order ? 1 : -1));
    }
    return outputArray;
};
