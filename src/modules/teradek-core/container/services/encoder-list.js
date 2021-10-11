"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const devicesCollection = await mongoCollection("devices");
    const encoders = await devicesCollection
        .find({ type: "encoder" })
        .toArray();

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
        };
    };

    if (encoders) {
        for (const eachEncoder of encoders) {
            const encoderItem = {
                "id": eachEncoder.sid,
                "label": eachEncoder.name
            }
            filteredList.push(ensureUniqueKey(filteredList, encoderItem));
        }
    }

    return filteredList;

};
