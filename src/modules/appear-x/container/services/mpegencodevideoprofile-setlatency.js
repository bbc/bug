"use strict";

const mongoSingle = require("@core/mongo-single");
const mpegEncodeVideoProfileUpdate = require("@utils/mpegencodevideoprofile-update");

module.exports = async (videoProfileId, latency) => {
    // fetch existing data
    const mpegEncodeVideoProfiles = await mongoSingle.get("mpegEncodeVideoProfiles");

    if (!mpegEncodeVideoProfiles) {
        return false;
    }
    const mpegEncodeVideoProfile = mpegEncodeVideoProfiles.find((e) => e.key === videoProfileId);
    if (!mpegEncodeVideoProfile) {
        console.log(`encodevideoprofile-setlatency: profile id ${videoProfileId} not found`);
        return false;
    }

    // change values
    mpegEncodeVideoProfile.value.latency = latency;

    // update some other parameters to match
    if (latency === "NORMAL") {
        mpegEncodeVideoProfile.value.gop.structure = "IPB";
        mpegEncodeVideoProfile.value.gop.maxBframes = 2;
    } else if (latency === "LOW") {
        mpegEncodeVideoProfile.value.gop.structure = "IP";
        mpegEncodeVideoProfile.value.gop.maxBframes = 0;
    } else if (latency === "ULL") {
        mpegEncodeVideoProfile.value.gop.structure = "GDR";
        mpegEncodeVideoProfile.value.gop.maxBframes = 0;
    }

    console.log(`encodevideoprofile-setlatency: setting latency to ${latency} for profile id ${videoProfileId}`);

    // save to device/db
    return (
        (await mpegEncodeVideoProfileUpdate(mpegEncodeVideoProfile)) &&
        (await mongoSingle.set("mpegEncodeVideoProfiles", mpegEncodeVideoProfiles, 60))
    );
};
