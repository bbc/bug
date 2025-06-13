"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);
const destinationListAll = require("./destination-listall");
const sourceListAll = require("./source-listall");
const destinationGroupList = require("./destinationgroup-list");
const mongoSingle = require("@core/mongo-single");

module.exports = async (groupIndex = 0, showExcluded = false) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`matrix-getdestinations: failed to fetch config`);
        return false;
    }

    const destinations = await mongoSingle.get("destinations");
    const sources = await mongoSingle.get("sources");

    const icons = config.destinationIcons ? config.destinationIcons : [];
    const iconColors = config.destinationIconColors ? config.destinationIconColors : [];
    const groups = await destinationGroupList();

    // get routes
    const routesCollection = await mongoCollection("routes");
    const crosspoints = await routesCollection.find().toArray();

    const outputArray = {
        groups: groups.map((g) => {
            return {
                label: g.label,
                index: g.index,
                fixed: g.fixed,
                empty: g.empty,
                id: g.id,
                selected: g.index === parseInt(groupIndex)
            }
        }),
        destinations: [],
    };

    // calculate excluded sources
    // not that this field is an array of strings - so we call toString() on each check later on. Grrrrr.
    const excludedDestinations = config["excludeDestinations"] ? config["excludeDestinations"] : [];

    const buttonsFixed = groups[groupIndex]?.fixed ?? false;

    groups[groupIndex]?.["value"].forEach((destinationIndex, order) => {
        const selectedSource = crosspoints?.[destinationIndex]?.levels["0"];
        const selectedSourceLabel = sources?.[selectedSource]?.name;

        const isExcluded = excludedDestinations.includes(destinationIndex?.toString());

        const indexText = config["showNumber"] === false ? "" : destinationIndex + 1;

        if (!isExcluded || showExcluded) {
            outputArray["destinations"].push({
                index: destinationIndex,
                label: destinations?.[destinationIndex]?.name,
                description: destinations?.[destinationIndex]?.description,
                fixed: buttonsFixed,
                sourceIndex: parseInt(selectedSource),
                sourceLabel: selectedSourceLabel,
                indexText: indexText,
                hidden: isExcluded,
                order: order,
                isLocked: config.destinationLocks?.[destinationIndex] ?? false,
                icon: icons[destinationIndex] ? icons[destinationIndex] : null,

                iconColor: iconColors[destinationIndex] ? iconColors[destinationIndex] : "#ffffff",
            });
        }
    });

    // sort by order field
    outputArray["destinations"].sort((a, b) => (a.order > b.order ? 1 : -1));

    return outputArray;
};
