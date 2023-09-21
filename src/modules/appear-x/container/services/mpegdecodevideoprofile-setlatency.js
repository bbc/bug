"use strict";

const mongoSingle = require("@core/mongo-single");
const mpegDecodeVideoProfileUpdate = require("@utils/mpegdecodevideoprofile-update");

module.exports = async (videoProfileId, latency) => {
    // fetch existing data
    const mpegDecodeVideoProfiles = await mongoSingle.get("mpegDecodeVideoProfiles");

    if (!mpegDecodeVideoProfiles) {
        return false;
    }
    const mpegDecodeVideoProfile = mpegDecodeVideoProfiles.find((e) => e.key === videoProfileId);
    if (!mpegDecodeVideoProfile) {
        console.log(`decodevideoprofile-setlatency: profile id ${videoProfileId} not found`);
        return false;
    }

    // change values
    mpegDecodeVideoProfile.value.latency = latency;

    // update some other parameters to match
    // if (latency === "NORMAL") {
    //     mpegDecodeVideoProfile.value.gop.structure = "IPB";
    //     mpegDecodeVideoProfile.value.gop.maxBframes = 2;
    // } else if (latency === "LOW") {
    //     mpegDecodeVideoProfile.value.gop.structure = "IP";
    //     mpegDecodeVideoProfile.value.gop.maxBframes = 0;
    // } else if (latency === "ULL") {
    //     mpegDecodeVideoProfile.value.gop.structure = "GDR";
    //     mpegDecodeVideoProfile.value.gop.maxBframes = 0;
    // }

    console.log(`decodevideoprofile-setlatency: setting latency to ${latency} for profile id ${videoProfileId}`);

    // save to device/db
    return (
        (await mpegDecodeVideoProfileUpdate(mpegDecodeVideoProfile)) &&
        (await mongoSingle.set("mpegDecodeVideoProfiles", mpegDecodeVideoProfiles, 60))
    );
};
