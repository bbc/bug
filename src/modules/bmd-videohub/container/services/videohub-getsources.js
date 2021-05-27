"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const indexRangeExpand = require("@utils/indexrange-expand");

module.exports = async (destinationIndex = null, groupIndex = null) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`videohub-getsources: failed to fetch config`);
        return false;
    }

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

    // add groups to output array
    groups.forEach((eachGroup, eachIndex) => {
        outputArray["groups"].push({
            label: eachGroup["name"],
            selected: eachIndex === parseInt(groupIndex),
            index: eachIndex,
        });
    });

    // then calculate valid sources for this group
    const validSources = groups[groupIndex] ? indexRangeExpand(groups[groupIndex]["value"]) : [];

    // calculate excluded sources too
    const excludedSources = indexRangeExpand(config["excludeSources"] ?? null);

    // get get the existing data from the db
    const dbOutputRouting = await dataCollection.findOne({ title: "video_output_routing" });
    const dbOutputLocks = await dataCollection.findOne({ title: "video_output_locks" });

    let sourcesLocked = false;
    let lockStatus;
    let selectedSourceIndex = null;
    if (destinationIndex !== null) {
        if (dbOutputRouting && dbOutputRouting["data"][destinationIndex] !== null) {
            selectedSourceIndex = parseInt(dbOutputRouting["data"][destinationIndex]);
        }
        if (dbOutputLocks && dbOutputLocks["data"][destinationIndex] !== null) {
            lockStatus = dbOutputLocks["data"][destinationIndex];
            sourcesLocked = lockStatus == "L" || lockStatus == "O";
        } else {
            lockStatus = "U";
        }
    }

    const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
    if (dbInputLabels) {
        for (const [eachIndex, eachValue] of Object.entries(dbInputLabels["data"])) {
            const intIndex = parseInt(eachIndex);
            // check it's not excluded or if it's a selected source - in which case we'll show it anyway
            const isExcluded = excludedSources.includes(intIndex);
            const isSelected = selectedSourceIndex === intIndex;
            const isInGroup = groupIndex === null || validSources.includes(intIndex);
            const indexText = config["showNumber"] === false ? "" : intIndex + 1;

            // set new order field - if in group then use the validsources index, otherwise the normal one
            let order;
            if (groupIndex !== null) {
                order = validSources.indexOf(intIndex);
            } else {
                order = intIndex;
            }

            if (isInGroup && !isExcluded) {
                outputArray["sources"].push({
                    index: intIndex,
                    label: eachValue,
                    selected: isSelected,
                    hidden: isExcluded,
                    indexText: indexText,
                    order: order,
                    isLocked: sourcesLocked,
                });
            }
        }

        // sort by order field
        outputArray["sources"].sort((a, b) => (a.order > b.order ? 1 : -1));
    }

    return outputArray;
};
