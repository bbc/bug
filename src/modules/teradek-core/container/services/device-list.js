"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const devicesCollection = await mongoCollection("devices");
    const devices = await devicesCollection.find().toArray();

    const filteredList = [];

    const ensureUniqueKey = (haystack, needle) => {
        let indexSuffix = 0;
        let suggestedKey = needle.label;
        while (true) {
            if (haystack.find((item) => item.label === suggestedKey)) {
                // it's already taken
                indexSuffix += 1;
                suggestedKey = `${needle.label} (${indexSuffix})`;
            } else {
                break;
            }
        }
        return {
            id: needle.id,
            label: suggestedKey,
            type: needle.type
        };
    };

    if (devices) {
        for (const eachDevice of devices) {
            const deviceItem = {
                "id": eachDevice.sid,
                "label": eachDevice.customName,
                "type": eachDevice.type
            }
            filteredList.push(ensureUniqueKey(filteredList, deviceItem));
        }
    }

    return filteredList;

};
