"use strict";

module.exports = (hexString) => {
    // we're looking for something like this: 9440.c94d.e7dc

    // check if the string contains three dots
    const hexArray = hexString.split(".");
    if (hexArray.length !== 3) {
        return hexString;
    }

    // check each entry has four characters
    const hexOutputArray = [];
    for (let eachHex of hexArray) {
        if (eachHex.length !== 4) {
            return hexString;
        }
        hexOutputArray.push(eachHex.substring(0, 2));
        hexOutputArray.push(eachHex.substring(2, 4));
    }

    return hexOutputArray.join(":");
};
