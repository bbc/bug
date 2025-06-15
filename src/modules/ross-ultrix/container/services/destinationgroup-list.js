"use strict";

const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");

module.exports = async () => {
    const config = await configGet();
    const destinations = await mongoSingle.get("destinations");
    const dbGroups = await mongoSingle.get("groups");

    if (!destinations) {
        return [];
    }

    const groups = [];
    let groupIndex = 0;

    const videoDestinations = destinations.filter((s) => s.type === "video");
    groups.push({
        index: groupIndex,
        label: `All Video`,
        value: videoDestinations?.map((s) => s.uiId) ?? [],
        fixed: true,
        empty: !videoDestinations?.length > 0
    });
    groupIndex += 1;

    if (config?.showAll) {
        // add an 'all' group
        groups.push({
            index: groupIndex,
            label: `All`,
            value: destinations?.map((s) => s.uiId),
            fixed: true,
            empty: false
        });
        groupIndex += 1;
    }
    // const audioDestinations = destinations.filter((s) => s.type === "audio");
    // if (audioDestinations?.length > 0) {
    //     groups.push({
    //         index: groupIndex,
    //         label: `All Audio`,
    //         value: audioDestinations.map((s) => s.uiId),
    //         fixed: true,
    //     });
    //     groupIndex += 1;
    // }

    const pipDestinations = destinations.filter((s) => s.type === "pip");
    groups.push({
        index: groupIndex,
        label: `All PIPs`,
        value: pipDestinations?.map((s) => s.uiId) ?? [],
        fixed: true,
        empty: !pipDestinations?.length > 0
    });
    groupIndex += 1;

    // add groups to output array
    dbGroups?.forEach((eachGroup, eachIndex) => {
        groups.push({
            index: groupIndex,
            label: eachGroup["name"],
            id: eachGroup["id"],
            fixed: false,
            value: eachGroup.destinations ?? [],
            empty: !eachGroup?.destinations?.length > 0
        });
        groupIndex += 1;
    });

    return groups;
};
