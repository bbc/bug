"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    const mpegEncodeAudioProfiles = await mongoSingle.get("mpegEncodeAudioProfiles");

    return (
        mpegEncodeAudioProfiles &&
        mpegEncodeAudioProfiles
            .map((profile) => {
                return {
                    id: profile.key,
                    ...profile.value,
                };
            })
            .sort((a, b) => a?.label.localeCompare(b?.label, "en", { sensitivity: "base" }))
    );
};
