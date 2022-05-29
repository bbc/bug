"use strict";

module.exports = (vlans, availableVlans) => {
    // check if ALL vlans are selected (the string 'ALL')
    if (vlans === "ALL") {
        return availableVlans;
    }

    // first of all split into array
    const vlanArray = vlans.split(",");
    const result = [];
    for (let eachRange of vlanArray) {
        if (eachRange.indexOf("-") > -1) {
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
