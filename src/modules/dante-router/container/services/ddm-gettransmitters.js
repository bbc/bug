"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (receiverIndex = null, groupIndex = null, showExcluded = false) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`ddm-gettransmitters: failed to fetch config`);
        return false;
    }

    const icons = config.transmitterIcons ? config.transmitterIcons : [];
    const iconColors = config.transmitterIconColors ? config.transmitterIconColors : [];

    const transmittersCollection = await mongoCollection("transmitters");

    const outputArray = {
        groups: [],
        transmitters: [],
    };

    // add groups first
    groupIndex = groupIndex < 0 ? null : groupIndex;

    const groups = config["transmitterGroups"] ?? [];
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
    const validTransmitters = groups[groupIndex] ? groups[groupIndex]["value"] : [];

    // get get the existing receivers from the db
    const transmitters = await transmittersCollection.find().toArray();

    if (transmitters) {
        for (let transmitter of transmitters) {
            outputArray["transmitters"].push({
                id: transmitter.id,
                index: transmitter.index,
                label: `${transmitter.device} ${transmitter.name}`,
                status: transmitter.status,
                //indexText: indexText,
                //order: order,
                //isLocked: isLocalLocked || isRemoteLocked,
                //isLocalLocked: isLocalLocked,
                //isRemoteLocked: isRemoteLocked,
                //icon: icons[intIndex] ? icons[intIndex] : null,
                //iconColor: iconColors[intIndex] ? iconColors[intIndex] : "#ffffff",
            });
        }

        // sort by order field
        outputArray["transmitters"].sort((a, b) => (a.order > b.order ? 1 : -1));
    }

    return outputArray;
};
