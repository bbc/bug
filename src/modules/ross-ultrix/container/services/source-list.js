"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);
const sourceGroupList = require("./sourcegroup-list");
const mongoSingle = require("@core/mongo-single");

module.exports = async (destinationIndex = null, groupIndex = 0, showExcluded = false) => {
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
    const sources = await mongoSingle.get("sources");
    const groups = await sourceGroupList();
    const routesCollection = await mongoCollection("routes");

    // check limited groups
    const limitSourceGroups = config.limitSourceGroups.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    let filteredGroups;
    if (limitSourceGroups.length > 0) {
        filteredGroups = groups.filter((g) =>
            limitSourceGroups.some((label) => label.toLowerCase() === g.label.toLowerCase())
        );
    }
    else {
        filteredGroups = groups;
    }

    const outputArray = {
        groups: filteredGroups.map((g) => {
            return {
                label: g.label,
                index: g.index,
                fixed: g.fixed,
                empty: g.empty,
                id: g.id,
                selected: g.index === parseInt(groupIndex)
            }
        }),
        sources: [],
    };
    // check that selected group is in the filteredGroups
    if (filteredGroups.some(
        (l) => l.label.toLowerCase() === groups[groupIndex].label.toLowerCase()
    )) {

        // calculate excluded sources
        // not that this field is an array of strings - so we call toString() on each check later on. Grrrrr.
        const excludedSources = config["excludeSources"] ? config["excludeSources"] : [];

        const buttonsFixed = groups[groupIndex]?.fixed ?? false;

        // get get existing routes from the db
        const crosspoints = await routesCollection.findOne({ destination: parseInt(destinationIndex) });

        let selectedSources = [];
        if (crosspoints?.levels) {
            selectedSources = Object.values(crosspoints?.levels) ?? [];
        }

        groups[groupIndex]?.["value"].forEach((sourceIndex, order) => {

            // check it's not excluded or if it's a selected source - in which case we'll show it anyway
            const isExcluded = excludedSources.includes(sourceIndex?.toString());
            const isSelected = selectedSources.includes(sourceIndex);
            if (!isExcluded || showExcluded) {
                outputArray["sources"].push({
                    index: sourceIndex,
                    label: sources[sourceIndex]?.name,
                    fixed: buttonsFixed,
                    description: sources[sourceIndex]?.description,
                    selected: isSelected,
                    hidden: isExcluded,
                    order: order,
                    icon: icons[sourceIndex] ? icons[sourceIndex] : null,
                    iconColor: iconColors[sourceIndex] ? iconColors[sourceIndex] : "#ffffff",
                });
            }
        })

        // sort by order field
        outputArray["sources"].sort((a, b) => (a.order > b.order ? 1 : -1));
    }
    return outputArray;
};
