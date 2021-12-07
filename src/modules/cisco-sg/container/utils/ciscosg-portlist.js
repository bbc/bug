"use strict";
const chunk = require("@core/chunk");

const hex2bin = (hex) => {
    return parseInt(hex, 16).toString(2).padStart(8, "0");
};

module.exports = (varbindValue) => {
    // we do this manually so we can specify that's it's a hex buffer
    const hexString = varbindValue.toString("hex");
    if (!hexString) {
        return [];
    }

    if (!isNaN(hexString) && parseInt(hexString) === 0) {
        // it's all zeros - therefore we can return an empty array
        return [];
    }

    // split the long hex string into 2 digit chunks
    const chunkedHex = chunk(hexString, 2);

    // we increase this with each binary character, and use it to reference the interface ID
    let interfaceIndex = 1;
    const result = [];
    for (let eachChunk of chunkedHex) {
        const binaryString = hex2bin(eachChunk);
        for (let eachChar of binaryString) {
            if (interfaceIndex < 1000) {
                if (eachChar === "1") {
                    result.push(interfaceIndex);
                }
                interfaceIndex += 1;
            }
        }
    }

    return result;
};
