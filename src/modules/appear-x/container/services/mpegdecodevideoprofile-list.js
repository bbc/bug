"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    // fetch video profiles

    const mpegDecodeVideoProfiles = await mongoSingle.get("mpegDecodeVideoProfiles");

    const parseResolution = (profile) => {
        try {
            const h = profile?.value?.resolution?.horizontal?.split("_")[1];
            const v = profile?.value?.resolution?.vertical?.split("_")[1];
            const scan = profile?.value?.resolution?.scan === "INTERLACED" ? "i" : "p";
            const fps = profile?.value?.resolution?.fps?.split("_")[1];
            return `${h}x${v}${scan}${fps}`;
        } catch (error) {
            return null;
        }
    };

    return (
        mpegDecodeVideoProfiles &&
        mpegDecodeVideoProfiles
            .map((profile) => {
                return {
                    id: profile.key,
                    ...profile.value,
                    _resolution: parseResolution(profile),
                };
            })
            .sort((a, b) => a?.label.localeCompare(b?.label, "en", { sensitivity: "base" }))
    );
};
