"use strict";

exports.parse = function (xml) {
    // pass in levels like this:
    // <levels clip="0000" ralf="0" rals="0" rarf="0" rars="0" rmlf="-inf" rmls="-1431879" rmrf="-inf" rmrs="-1431879" talf="0" tals="0" tarf="0" tars="0" tmlf="-inf" tmls="-inf" tmrf="-inf" tmrs="-inf"/>

    const parseVal = (val, offsetValue = 0) => {
        if (val === "-inf") {
            return -72 + offsetValue;
        }
        if (val === "inf") {
            return "inf";
        }
        return parseFloat(val) + offsetValue;
    };

    if (xml?.children?.[0]?.name === "levels") {
        const levels = xml?.children?.[0]?.attributes;

        const clip = {
            "output-left": levels?.clip?.[0] === "1",
            "output-right": levels?.clip?.[1] === "1",
            "input-left": levels?.clip?.[2] === "1",
            "input-right": levels?.clip?.[3] === "1",
        };

        return {
            clip: clip,
            // "output-left": parseVal(levels?.tmlf),
            // "output-right": parseVal(levels?.tmrf),
            // "input-left": parseVal(levels?.rmlf),
            // "input-right": parseVal(levels?.rmrf),
            "output-left": parseVal(levels?.tmlf, 72),
            "output-right": parseVal(levels?.tmrf, 72),
            "input-left": parseVal(levels?.rmlf, 72),
            "input-right": parseVal(levels?.rmrf, 72),
        };
    }
    return false;
};
