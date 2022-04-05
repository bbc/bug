"use strict";

exports.parse = function (xml) {
    // pass in levels like this:
    // <levels clip="0000" ralf="0" rals="0" rarf="0" rars="0" rmlf="-inf" rmls="-1431879" rmrf="-inf" rmrs="-1431879" talf="0" tals="0" tarf="0" tars="0" tmlf="-inf" tmls="-inf" tmrf="-inf" tmrs="-inf"/>

    if (xml?.children?.[0]?.name === "levels") {
        return { ...xml?.children?.[0]?.attributes };
    }
    return false;
};
