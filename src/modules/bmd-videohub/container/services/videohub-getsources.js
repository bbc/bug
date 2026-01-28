"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (destinationIndex = null, groupIndex = null, showExcluded = false) => {
    let config;
    try {
        config = await configGet();
        if (!config) throw new Error();
    } catch (error) {
        logger.error(`videohub-getsources: failed to fetch config`);
        return false;
    }

    // fallback to empty arrays if not defined
    const icons = config.sourceIcons ?? [];
    const iconColors = config.sourceIconColors ?? [];
    const sourceQuads = config.sourceQuads ?? [];
    const destinationQuads = config.destinationQuads ?? [];
    const excludedSources = config.excludeSources ?? [];
    const groups = config.sourceGroups ?? [];

    // validate groupIndex
    groupIndex = Number.isInteger(groupIndex) && groupIndex >= 0 ? groupIndex : null;

    // if no groupIndex given, default to 0 if groups exist
    groupIndex = groups.length > 0 ? groupIndex ?? 0 : null;

    const dataCollection = await mongoCollection("data");

    const outputArray = {
        groups: [],
        sources: [],
    };

    // add groups first
    outputArray.groups = groups.map((eachGroup, eachIndex) => ({
        label: eachGroup.name,
        selected: eachIndex === groupIndex,
        index: eachIndex,
    }));

    // then calculate valid sources for this group
    const validSources = groups[groupIndex]?.value ?? [];

    // get the existing data from the db
    const dbOutputRouting = await dataCollection.findOne({ title: "video_output_routing" });

    // initialize selectedSourceIndex for currently selected destination
    let selectedSourceIndex = null;
    if (destinationIndex !== null) {
        if (dbOutputRouting?.data?.[destinationIndex] !== null) {
            selectedSourceIndex = parseInt(dbOutputRouting.data[destinationIndex]);
        }

        // check quad destinations
        // it's a quad destination, so we need to check that the following 3 sources match the following 3 destinations
        const isValidQuad = (startIndex, selectedSource) =>
            [1, 2, 3].every(a => parseInt(dbOutputRouting?.data?.[startIndex + a]) === selectedSource + a);

        if (destinationQuads?.[destinationIndex] && !isValidQuad(destinationIndex, selectedSourceIndex)) {
            selectedSourceIndex = null;
        }
    }

    // get input labels from the db
    const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
    if (dbInputLabels) {
        for (const [eachIndexStr, eachValue] of Object.entries(dbInputLabels.data)) {
            const intIndex = parseInt(eachIndexStr);

            // check it's not excluded or if it's a selected source - in which case we'll show it anyway
            const isExcluded = excludedSources.includes(intIndex.toString());
            const isSelected = selectedSourceIndex === intIndex;
            const isInGroup = groupIndex === null || validSources.includes(intIndex);

            // set new order field - if in group then use the validsources index, otherwise the normal one
            const order = groupIndex !== null ? validSources.indexOf(intIndex) : intIndex;

            if (isInGroup && (!isExcluded || showExcluded)) {
                outputArray.sources.push({
                    index: intIndex,
                    label: eachValue,
                    selected: isSelected,
                    hidden: isExcluded,
                    order: order,
                    isQuad: !!sourceQuads[intIndex],
                    icon: icons[intIndex] ?? null,
                    iconColor: iconColors[intIndex] ?? "#ffffff",
                });
            }
        }

        // sort by order field
        outputArray.sources.sort((a, b) => a.order - b.order);
    }

    return outputArray;
};
