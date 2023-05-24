"use strict";

const mongoSingle = require("@core/mongo-single");
const mpegEncodeVideoProfileUpdate = require("@utils/mpegencodevideoprofile-update");

module.exports = async (videoProfileId, bitrate) => {
    // fetch existing data
    const mpegEncodeVideoProfiles = await mongoSingle.get("mpegEncodeVideoProfiles");

    if (!mpegEncodeVideoProfiles) {
        return false;
    }
    const mpegEncodeVideoProfile = mpegEncodeVideoProfiles.find((e) => e.key === videoProfileId);
    if (!mpegEncodeVideoProfile) {
        console.log(`encodevideoprofile-setbitrate: profile id ${videoProfileId} not found`);
        return false;
    }

    // change values
    mpegEncodeVideoProfile.value.bitrate = parseInt(bitrate);

    console.log(`encodevideoprofile-setbitrate: setting bitrate to ${bitrate} for profile id ${videoProfileId}`);

    // save to device/db
    return (
        (await mpegEncodeVideoProfileUpdate(mpegEncodeVideoProfile)) &&
        (await mongoSingle.set("mpegEncodeVideoProfiles", mpegEncodeVideoProfiles, 60))
    );
};
