"use strict";

exports.parse = function (xml) {
    // pass in one of these:
    // <currentEncoder codec="audio/unknown" descr=""/>

    if (xml?.children?.[0]?.name === "currentEncoder") {
        // copy the attributes
        return { ...xml?.children?.[0]?.attributes };
    }
    return false;
};
