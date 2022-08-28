"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const profileList = await mongoSingle.get("profileList");
    return (
        profileList &&
        profileList.map((profile) => {
            return {
                id: profile.id,
                label: profile.settings.name,
            };
        })
    );
};
