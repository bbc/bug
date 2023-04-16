"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (groupIndex = null, showExcluded = false) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`ddm-getreceivers: failed to fetch config`);
        return false;
    }

    const icons = config.receiverIcons ? config.receiverIcons : [];
    const iconColors = config.receiverIconColors ? config.receiverIconColors : [];

    const dataCollection = await mongoCollection("data");

    const outputArray = {
        groups: [],
        receivers: [],
    };

    // add groups first
    groupIndex = groupIndex < 0 ? null : groupIndex;

    const groups = config["receiverGroups"] ?? [];
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

    // then calculate valid transmitters for this group
    const validReceivers = groups[groupIndex] ? groups[groupIndex]["value"] : [];

    // calculate excluded transmitters too
    // not that this field is an array of strings - so we call toString() on each check later on. Grrrrr.
    const excludedReceivers = config["excludeReceivers"] ? config["excludeReceivers"] : [];

    // get get the existing data from the db
    const dbOutputLabels = await dataCollection.findOne({ title: "output_labels" });
    const dbOutputRouting = await dataCollection.findOne({ title: "video_output_routing" });
    const dbInputLabels = await dataCollection.findOne({ title: "input_labels" });
    const dbOutputLocks = await dataCollection.findOne({ title: "video_output_locks" });

    if (dbOutputLabels && dbOutputRouting && dbInputLabels) {
        for (const [eachIndex, eachValue] of Object.entries(dbOutputLabels["data"])) {
            const intIndex = parseInt(eachIndex);
            const selectedTransmitter = dbOutputRouting["data"][eachIndex];
            const selectedTransmitterLabel = dbInputLabels.data[selectedTransmitter];
            const isExcluded = excludedReceivers.includes(intIndex.toString());
            const isInGroup = groupIndex === null || validReceivers.includes(intIndex);

            let isLocalLocked = false;
            let isRemoteLocked = false;

            if (dbOutputLocks && dbOutputLocks["data"][eachIndex]) {
                isLocalLocked = dbOutputLocks["data"][eachIndex] == "O";
                isRemoteLocked = dbOutputLocks["data"][eachIndex] == "L";
            }

            const indexText = config["showNumber"] === false ? "" : intIndex + 1;

            // set new order field - if in group then use the validtransmitters index, otherwise the normal one
            let order;
            if (groupIndex !== null) {
                order = validReceivers.indexOf(intIndex);
            } else {
                order = intIndex;
            }

            if (isInGroup && (!isExcluded || showExcluded)) {
                outputArray["receivers"].push({
                    index: intIndex,
                    label: eachValue,
                    transmitterIndex: parseInt(selectedTransmitter),
                    transmitterLabel: selectedTransmitterLabel,
                    indexText: indexText,
                    hidden: isExcluded,
                    order: order,
                    isLocked: isLocalLocked || isRemoteLocked,
                    isLocalLocked: isLocalLocked,
                    isRemoteLocked: isRemoteLocked,
                    icon: icons[intIndex] ? icons[intIndex] : null,
                    iconColor: iconColors[intIndex] ? iconColors[intIndex] : "#ffffff",
                });
            }
        }

        // sort by order field
        outputArray["receivers"].sort((a, b) => (a.order > b.order ? 1 : -1));
    }
    return outputArray;
};
