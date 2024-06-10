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
        logger.error(`videohub-getsources: failed to fetch config`);
        return false;
    }

    const icons = config.sourceIcons ? config.sourceIcons : [];
    const iconColors = config.sourceIconColors ? config.sourceIconColors : [];
    const sourceQuads = config.sourceQuads ? config.sourceQuads : [];
    const destinationQuads = config.destinationQuads ? config.destinationQuads : [];

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
    const dbOutputRouting = await dataCollection.findOne({ title: "video_output_routing" });

    let selectedSourceIndex = null;
    if (destinationIndex !== null) {
        // save the selected source index for the currently selected destination
        if (dbOutputRouting?.["data"]?.[destinationIndex] !== null) {
            selectedSourceIndex = parseInt(dbOutputRouting?.["data"]?.[destinationIndex]);
        }

        if (destinationQuads?.[destinationIndex] === true) {
            // it's a quad destination, so we need to check that the following 3 sources match the following 3 destinations
            for (let a = 1; a < 4; a++) {
                if (parseInt(dbOutputRouting?.["data"]?.[parseInt(destinationIndex) + a]) !== selectedSourceIndex + a) {
                    selectedSourceIndex = null;
                }
            }
        }
    }

    const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
    if (dbInputLabels) {
        for (const [eachIndex, eachValue] of Object.entries(dbInputLabels["data"])) {
            const intIndex = parseInt(eachIndex);
            // check it's not excluded or if it's a selected source - in which case we'll show it anyway
            const isExcluded = excludedSources.includes(intIndex.toString());
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
                    label: eachValue,
                    selected: isSelected,
                    hidden: isExcluded,
                    order: order,
                    isQuad: sourceQuads?.[intIndex] === true,
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
