"use strict";

const mongoSingle = require("@core/mongo-single");
const encodeVideoProfileUpdate = require("@utils/encodevideoprofile-update");

module.exports = async (videoProfileId, latency) => {
    // fetch existing data
    const encodeVideoProfiles = await mongoSingle.get("encodeVideoProfiles");

    if (!encodeVideoProfiles) {
        return false;
    }
    const encodeVideoProfile = encodeVideoProfiles.find((e) => e.key === videoProfileId);
    if (!encodeVideoProfile) {
        console.log(`encodevideoprofile-setlatency: profile id ${videoProfileId} not found`);
        return false;
    }

    // change values
    encodeVideoProfile.value.latency = latency;

    // update some other parameters to match
    if (latency === "NORMAL") {
        encodeVideoProfile.value.gop.structure = "IPB";
        encodeVideoProfile.value.gop.maxBframes = 2;
    } else if (latency === "LOW") {
        encodeVideoProfile.value.gop.structure = "IP";
        encodeVideoProfile.value.gop.maxBframes = 0;
    } else if (latency === "ULL") {
        encodeVideoProfile.value.gop.structure = "GDR";
        encodeVideoProfile.value.gop.maxBframes = 0;
    }

    console.log(`encodevideoprofile-setlatency: setting latency to ${latency} for profile id ${videoProfileId}`);

    // save to device/db
    return (
        (await encodeVideoProfileUpdate(encodeVideoProfile)) &&
        (await mongoSingle.set("encodeVideoProfiles", encodeVideoProfiles, 60))
    );
};
