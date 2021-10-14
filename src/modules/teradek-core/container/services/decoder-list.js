"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const devicesCollection = await mongoCollection("devices");
    const decoders = await devicesCollection
        .find({ type: "decoder" })
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

    if (decoders) {
        for (const eachDecoder of decoders) {
            const decoderItem = {
                "id": eachDecoder.sid,
                "label": eachDecoder.customName
            }
            filteredList.push(ensureUniqueKey(filteredList, decoderItem));
        }
    }

    return filteredList;

};
