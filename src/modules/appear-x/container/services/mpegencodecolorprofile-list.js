"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    const mpegEncodeColorProfiles = await mongoSingle.get("mpegEncodeColorProfiles");

    return (
        mpegEncodeColorProfiles &&
        mpegEncodeColorProfiles
            .map((profile) => {
                return {
                    id: profile.key,
                    ...profile.value,
                };
            })
            .sort((a, b) => a?.label.localeCompare(b?.label, "en", { sensitivity: "base" }))
    );
};
