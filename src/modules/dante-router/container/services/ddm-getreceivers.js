"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const getChannelId = require("@services/ddm-getchannelid");

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

    const receiversCollection = await mongoCollection("receivers");

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

    // get get the existing receivers from the db
    const receivers = await receiversCollection.find().toArray();
    if (receivers) {
        for (let receiver of receivers) {
            outputArray["receivers"].push({
                id: receiver.id,
                index: receiver.index,
                label: `${receiver.device} ${receiver.name}`,
                status: receiver.status,
                transmitterId: getChannelId(receiver.subscribedDevice, receiver.subscribedChannel, "tx"),
                transmitterLabel: `${receiver.subscribedDevice} ${receiver.subscribedChannel}`,
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
        outputArray["receivers"].sort((a, b) => (a.order > b.order ? 1 : -1));
    }
    return outputArray;
};
