"use strict";

module.exports = (vlanArray, availableVlans) => {

    if (vlanArray.length === 1 && vlanArray[0] === "1-4093") {
        // return all VLANs (even non-configured ones)
        return Array.from({ length: 4093 }, (v, i) => i + 1);
    }

    // first of all split into array
    const result = [];
    for (let eachRange of vlanArray) {
        if (typeof eachRange === "string" && eachRange.indexOf("-") > -1) {
            // it's a range
            const rangeArray = eachRange.split("-");
            if (rangeArray.length === 2) {
                const start = parseInt(rangeArray[0]);
                const end = parseInt(rangeArray[1]);
                for (let index = start; index < end + 1; index++) {
                    if (availableVlans.includes(index)) {
                        result.push(index);
                    }
                }
            }
        } else {
            // it's just a single value
            if (availableVlans.includes(parseInt(eachRange))) {
                result.push(parseInt(eachRange));
            }
        }
    }
    return result;
};
