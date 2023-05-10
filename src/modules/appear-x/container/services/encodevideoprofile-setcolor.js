"use strict";

const mongoSingle = require("@core/mongo-single");
const encodeVideoProfileUpdate = require("@utils/encodevideoprofile-update");

module.exports = async (videoProfileId, bitDepth, chromaSampling) => {
    // fetch existing data
    const encodeVideoProfiles = await mongoSingle.get("encodeVideoProfiles");

    if (!encodeVideoProfiles) {
        return false;
    }
    const encodeVideoProfile = encodeVideoProfiles.find((e) => e.key === videoProfileId);
    if (!encodeVideoProfile) {
        console.log(`encodevideoprofile-setcolor: profile id ${videoProfileId} not found`);
        return false;
    }

    // change values
    encodeVideoProfile.value.bitDepth = parseInt(bitDepth);
    encodeVideoProfile.value.resolution.chromaSampling = chromaSampling;
    if (encodeVideoProfile.value.codec === "AVC") {
        // update some other parameters to match
        if (chromaSampling === "CS_420") {
            encodeVideoProfile.value.cparams.avc.profile = parseInt(bitDepth) === 8 ? "HIGH" : "HIGH10";
        } else {
            // 4:2:2
            encodeVideoProfile.value.cparams.avc.profile = "HIGH42210";
        }
    }

    console.log(
        `encodevideoprofile-setbitrate: setting bitDepth to ${bitDepth}, chromaSampling to ${chromaSampling} for profile id ${videoProfileId}`
    );

    // save to device/db
    return (
        (await encodeVideoProfileUpdate(encodeVideoProfile)) &&
        (await mongoSingle.set("encodeVideoProfiles", encodeVideoProfiles, 60))
    );
};
