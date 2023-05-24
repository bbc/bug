"use strict";

const mongoSingle = require("@core/mongo-single");
const mpegEncodeVideoProfileUpdate = require("@utils/mpegencodevideoprofile-update");

module.exports = async (videoProfileId, bitDepth, chromaSampling) => {
    // fetch existing data
    const mpegEncodeVideoProfiles = await mongoSingle.get("mpegEncodeVideoProfiles");

    if (!mpegEncodeVideoProfiles) {
        return false;
    }
    const mpegEncodeVideoProfile = mpegEncodeVideoProfiles.find((e) => e.key === videoProfileId);
    if (!mpegEncodeVideoProfile) {
        console.log(`encodevideoprofile-setcolor: profile id ${videoProfileId} not found`);
        return false;
    }

    // change values
    mpegEncodeVideoProfile.value.bitDepth = parseInt(bitDepth);
    mpegEncodeVideoProfile.value.resolution.chromaSampling = chromaSampling;
    if (mpegEncodeVideoProfile.value.codec === "AVC") {
        // update some other parameters to match
        if (chromaSampling === "CS_420") {
            mpegEncodeVideoProfile.value.cparams.avc.profile = parseInt(bitDepth) === 8 ? "HIGH" : "HIGH10";
        } else {
            // 4:2:2
            mpegEncodeVideoProfile.value.cparams.avc.profile = "HIGH42210";
        }
    }

    console.log(
        `encodevideoprofile-setbitrate: setting bitDepth to ${bitDepth}, chromaSampling to ${chromaSampling} for profile id ${videoProfileId}`
    );

    // save to device/db
    return (
        (await mpegEncodeVideoProfileUpdate(mpegEncodeVideoProfile)) &&
        (await mongoSingle.set("mpegEncodeVideoProfiles", mpegEncodeVideoProfiles, 60))
    );
};
