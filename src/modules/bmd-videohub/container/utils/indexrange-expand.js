"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");

module.exports = (configText) => {
    const returnArray = [];
    if (configText) {
        const excludeArray = configText.split(",");
        excludeArray.forEach((eachVal) => {
            eachVal = eachVal.trim();
            if (!isNaN(eachVal)) {
                // adjust for zero-based indicies
                returnArray.push(parseInt(eachVal) - 1);
            } else if (eachVal.indexOf("-") > -1) {
                // it might be a range
                const rangeArray = eachVal.split("-");

                if (rangeArray.length == 2) {
                    if (!isNaN(rangeArray[0]) && !isNaN(rangeArray[1])) {
                        const start = parseInt(rangeArray[0]);
                        const end = parseInt(rangeArray[1]);

                        if (end > start) {
                            for (let i = start; i < end + 1; i++) {
                                // adjust for zero-based indicies
                                returnArray.push(i - 1);
                            }
                        }
                    }
                }
            }
        });
    }
    return returnArray;
};
