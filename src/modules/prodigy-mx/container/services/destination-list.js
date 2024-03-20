"use strict";

const mongoSingle = require("@core/mongo-single");
const groupsList = require("@services/groups-list");
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

    // const icons = config.destinationIcons ? config.destinationIcons : [];
    // const iconColors = config.destinationIconColors ? config.destinationIconColors : [];

    // const dataCollection = await mongoCollection("data");

    const outputArray = {
        groups: [],
        destinations: [],
    };

    // add groups first
    // groupIndex = groupIndex < 0 ? null : groupIndex;

    const groups = await groupsList("destination");

    // add groups to output array
    groups.forEach((eachGroup, eachIndex) => {
        outputArray["groups"].push({
            label: eachGroup["name"],
            selected: eachIndex === parseInt(groupIndex),
            index: eachIndex,
        });
    });

    // then calculate valid destinations for this group
    const validDestinations = groups[groupIndex] ? groups[groupIndex]["value"] : [];

    // calculate excluded destinations too
    // not that this field is an array of strings - so we call toString() on each check later on. Grrrrr.
    // const excludedDestinations = config["excludeDestinations"] ? config["excludeDestinations"] : [];

    // get get the existing data from the db
    const outputLabels = await mongoSingle.get("output_labels");
    const inputLabels = await mongoSingle.get("input_labels");
    const routing = await mongoSingle.get("routing");

    // console.log(routing[1538]);
    if (outputLabels && routing && inputLabels) {
        outputArray["destinations"] = outputLabels
            .filter((labelItem, index) => validDestinations.includes(index))
            .map((labelItem) => {
                const sourceIndex = routing[labelItem[0]][1];

                return {
                    index: labelItem[0],
                    label: labelItem[1],
                    sourceIndex: sourceIndex,
                    sourceLabel: sourceIndex > -1 ? inputLabels[sourceIndex][1] : "",
                    indexText: config["showNumber"] === false ? "" : labelItem[0] + 1,
                    // hidden: isExcluded,
                    order: groupIndex !== null ? validDestinations.indexOf(labelItem[0]) : labelItem[0],
                    // isLocked: isLocalLocked || isRemoteLocked,
                    // isLocalLocked: isLocalLocked,
                    // isRemoteLocked: isRemoteLocked,
                    // icon: icons[intIndex] ? icons[intIndex] : null,
                    // iconColor: iconColors[intIndex] ? iconColors[intIndex] : "#ffffff",
                };
            });
    }
    // for (const [eachIndex, eachValue] of Object.entries(dbOutputLabels["data"])) {
    //     const intIndex = parseInt(eachIndex);
    //     const selectedSource = dbOutputRouting["data"][eachIndex];
    //     // const selectedSourceLabel = dbInputLabels.data[selectedSource];
    //     // const isExcluded = excludedDestinations.includes(intIndex.toString());
    //     const isInGroup = groupIndex === null || validDestinations.includes(intIndex);

    //     // let isLocalLocked = false;
    //     // let isRemoteLocked = false;

    //     // if (dbOutputLocks && dbOutputLocks["data"][eachIndex]) {
    //     //     isLocalLocked = dbOutputLocks["data"][eachIndex] == "O";
    //     //     isRemoteLocked = dbOutputLocks["data"][eachIndex] == "L";
    //     // }

    //     const indexText = config["showNumber"] === false ? "" : intIndex + 1;

    //     // set new order field - if in group then use the validsources index, otherwise the normal one
    //     let order;
    //     if (groupIndex !== null) {
    //         order = validDestinations.indexOf(intIndex);
    //     } else {
    //         order = intIndex;
    //     }

    //     if (isInGroup && (!isExcluded || showExcluded)) {
    //         outputArray["destinations"].push({
    //             // index: intIndex,
    //             // label: eachValue,
    //             // sourceIndex: parseInt(selectedSource),
    //             // sourceLabel: selectedSourceLabel,
    //             // indexText: indexText,
    //             // hidden: isExcluded,
    //             // order: order,
    //             // isLocked: isLocalLocked || isRemoteLocked,
    //             // isLocalLocked: isLocalLocked,
    //             // isRemoteLocked: isRemoteLocked,
    //             // icon: icons[intIndex] ? icons[intIndex] : null,
    //             // iconColor: iconColors[intIndex] ? iconColors[intIndex] : "#ffffff",
    //         });
    //     }
    // }

    // sort by order field
    outputArray["destinations"].sort((a, b) => (a.order > b.order ? 1 : -1));

    return outputArray;
};
