"use strict";

module.exports = (res) => {
    if (res.headers?.["content-type"]) {
        const splitParts = res.headers?.["content-type"].split(";");
        for (let eachPart of splitParts) {
            if (eachPart.startsWith("boundary=")) {
                return eachPart.substr("boundary=".length);
            }
        }
        return null;
    }
};
