"use strict";

const processValue = (value) => {
    if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1);
        value = value.substring(0, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1);
        value = value.substring(0, value.length - 1);
    }
    return value;
};

module.exports = (data) => {
    const dataLines = data.split(";");
    const returnArray = {};

    // these look something like this:
    // document.getElementById('videoGeneration:vidPatternCh1').value = "0"`

    if (dataLines && Array.isArray(dataLines)) {
        for (const eachItem of dataLines) {
            if (eachItem.indexOf("document.getElementById") === 0) {
                // ignore backgroundColor elements (as they overwrite values)
                if (eachItem.indexOf(".style.backgroundColor") === -1) {
                    const nameValuePair = eachItem.split(" = ");
                    if (nameValuePair && nameValuePair.length === 2) {
                        const nameSplit = nameValuePair[0].split("'");
                        if (nameSplit && nameSplit.length === 3) {
                            const nameCategory = nameSplit[1].split(":");

                            if (nameCategory.length === 1) {
                                returnArray[nameCategory[0]] = processValue(nameValuePair[1]);
                            }

                            if (nameCategory.length === 2) {
                                // we have a category
                                if (!returnArray[nameCategory[0]]) {
                                    returnArray[nameCategory[0]] = {};
                                }

                                returnArray[nameCategory[0]][nameCategory[1]] = processValue(nameValuePair[1]);
                            }
                        }
                    }
                }
            }
        }
    }

    return returnArray;
};
