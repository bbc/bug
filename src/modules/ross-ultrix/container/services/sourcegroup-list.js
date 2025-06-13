"use strict";

const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");

module.exports = async () => {
    const config = await configGet();
    const sources = await mongoSingle.get("sources");
    const dbGroups = await mongoSingle.get("groups");

    if (!sources) {
        return [];
    }

    const groups = [];
    let groupIndex = 0;

    const videoSources = sources.filter((s) => s.type === "video");
    groups.push({
        index: groupIndex,
        label: `All Video`,
        value: videoSources?.map((s) => s.uiId) ?? [],
        fixed: true,
        empty: !videoSources?.length > 0
    });
    groupIndex += 1;

    // const audioSources = sources.filter((s) => s.type === "audio");
    // if (audioSources?.length > 0) {
    //     groups.push({
    //         index: groupIndex,
    //         label: `All Audio`,
    //         value: audioSources.map((s) => s.uiId),
    //         fixed: true,
    //     });
    //     groupIndex += 1;
    // }

    const virtualSources = sources.filter((s) => s.type === "virtual");
    groups.push({
        index: groupIndex,
        label: `Virtual`,
        value: virtualSources?.map((s) => s.uiId) ?? [],
        fixed: true,
        empty: !virtualSources.length > 0
    });
    groupIndex += 1;

    if (config?.showAll) {
        // add an 'all' group
        groups.push({
            index: groupIndex,
            label: `All`,
            value: sources?.map((s) => s.uiId),
            fixed: true,
            empty: false
        });
        groupIndex += 1;
    }

    // add groups to output array
    dbGroups?.forEach((eachGroup, eachIndex) => {
        groups.push({
            index: groupIndex,
            label: eachGroup["name"],
            id: eachGroup["id"],
            fixed: false,
            value: eachGroup.sources ?? [],
            empty: !eachGroup?.sources?.length > 0
        });
        groupIndex += 1;
    });

    return groups;
};
