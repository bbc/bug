"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (groupIndex = null, showExcluded = false) => {
    try {
        // fetch config
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        // fallback to empty arrays if not defined
        const icons = config.destinationIcons ?? [];
        const iconColors = config.destinationIconColors ?? [];
        const quads = config.destinationQuads ?? [];

        const dataCollection = await mongoCollection("data");

        const outputArray = {
            groups: [],
            destinations: [],
        };

        // add groups first
        groupIndex = Number.isInteger(groupIndex) && groupIndex >= 0 ? groupIndex : null;

        const groups = config.destinationGroups ?? [];
        groupIndex = groups.length > 0 ? groupIndex ?? 0 : null;

        // add groups to output array
        outputArray.groups = groups.map((eachGroup, eachIndex) => ({
            label: eachGroup.name,
            selected: eachIndex === groupIndex,
            index: eachIndex,
        }));

        // then calculate valid destinations for this group
        const validDestinations = groups[groupIndex]?.value ?? [];

        // calculate excluded destinations too
        // note that this field is an array of strings - so we call toString() on each check later on. Grrrrr.
        const excludedDestinations = config.excludeDestinations ?? [];

        // get the existing data from the db
        const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
        const dbOutputRouting = await dataCollection.findOne({ title: "video_output_routing" });
        const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
        const dbOutputLocks = await dataCollection.findOne({ title: "video_output_locks" });

        if (dbOutputLabels && dbOutputRouting && dbInputLabels) {
            for (const [eachIndex, eachValue] of Object.entries(dbOutputLabels.data)) {
                const intIndex = parseInt(eachIndex);

                const selectedSource = dbOutputRouting.data[eachIndex];
                const selectedSourceLabel = dbInputLabels.data[selectedSource];
                const isExcluded = excludedDestinations.includes(intIndex.toString());
                const isInGroup = groupIndex === null || validDestinations.includes(intIndex);

                let isLocalLocked = false;
                let isRemoteLocked = false;

                if (dbOutputLocks?.data?.[eachIndex]) {
                    isLocalLocked = dbOutputLocks.data[eachIndex] === "O";
                    isRemoteLocked = dbOutputLocks.data[eachIndex] === "L";
                }

                const indexText = config.showNumber === false ? "" : intIndex + 1;

                // set new order field - if in group then use the validDestinations index, otherwise the normal one
                const order = groupIndex !== null ? validDestinations.indexOf(intIndex) : intIndex;

                if (isInGroup && (!isExcluded || showExcluded)) {
                    outputArray.destinations.push({
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
                        isQuad: !!quads[intIndex],
                        icon: icons[intIndex] ?? null,
                        iconColor: iconColors[intIndex] ?? "#ffffff",
                    });
                }
            }

            // sort by order field
            outputArray.destinations.sort((a, b) => a.order - b.order);
        } else {
            logger.warning("videohub-getdestinations: missing database data (output_labels, routing, or input_labels)");
        }

        // logger.info(`videohub-getdestinations: retrieved ${outputArray.destinations.length} destinations`);
        return outputArray;

    } catch (err) {
        err.message = `videohub-getdestinations: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
