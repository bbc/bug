"use strict";

module.exports = (ports) => {

    // first of all split into array
    const portArray = ports.split(",");
    const result = [];
    for (let eachPort of portArray) {
        if (eachPort.indexOf("-") > -1) {
            // it's a range
            const rangeArray = eachPort.split("-");
            if (rangeArray.length === 2) {
                const firstArray = rangeArray[0].match(/[a-zA-Z]+|[0-9]+/g);
                if (firstArray.length === 2) {
                    const start = parseInt(firstArray[1]);
                    const end = parseInt(rangeArray[1]);
                    for (let index = start; index < (end + 1); index++) {
                        result.push(`${firstArray[0]}${index}`);
                    }
                }
            }
            // 
        }
        else {
            // it's just a single value
            result.push(eachPort);
        }
    }
    return result;
}

