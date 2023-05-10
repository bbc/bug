"use strict";

const mongoSingle = require("@core/mongo-single");
const encodeVideoProfileUpdate = require("@utils/encodevideoprofile-update");

module.exports = async (videoProfileId, bitrate) => {
    // fetch existing data
    const encodeVideoProfiles = await mongoSingle.get("encodeVideoProfiles");

    if (!encodeVideoProfiles) {
        return false;
    }
    const encodeVideoProfile = encodeVideoProfiles.find((e) => e.key === videoProfileId);
    if (!encodeVideoProfile) {
        console.log(`encodevideoprofile-setbitrate: profile id ${videoProfileId} not found`);
        return false;
    }

    // change values
    encodeVideoProfile.value.bitrate = parseInt(bitrate);

    console.log(`encodevideoprofile-setbitrate: setting bitrate to ${bitrate} for profile id ${videoProfileId}`);

    // save to device/db
    return (
        (await encodeVideoProfileUpdate(encodeVideoProfile)) &&
        (await mongoSingle.set("encodeVideoProfiles", encodeVideoProfiles, 60))
    );
};
