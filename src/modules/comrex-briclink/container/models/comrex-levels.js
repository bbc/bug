"use strict";

exports.parse = function (xml) {
    // pass in levels like this:
    // <levels clip="0000" ralf="0" rals="0" rarf="0" rars="0" rmlf="-inf" rmls="-1431879" rmrf="-inf" rmrs="-1431879" talf="0" tals="0" tarf="0" tars="0" tmlf="-inf" tmls="-inf" tmrf="-inf" tmrs="-inf"/>

    const parseVal = (val) => {
        if (val === "-inf") {
            return "-inf";
        }
        if (val === "inf") {
            return "inf";
        }
        return parseInt(val);
    };

    if (xml?.children?.[0]?.name === "levels") {
        const levels = xml?.children?.[0]?.attributes;
        return {
            clip: levels?.clip,
            ralf: parseVal(levels?.ralf),
            rals: parseVal(levels?.rals),
            rarf: parseVal(levels?.rarf),
            rars: parseVal(levels?.rars),
            rmlf: parseVal(levels?.rmlf),
            rmls: parseVal(levels?.rmls),
            rmrf: parseVal(levels?.rmrf),
            rmrs: parseVal(levels?.rmrs),
            talf: parseVal(levels?.talf),
            tals: parseVal(levels?.tals),
            tmlf: parseVal(levels?.tmlf),
            tmls: parseVal(levels?.tmls),
            tmrs: parseVal(levels?.tmrs),
        };
    }
    return false;
};
