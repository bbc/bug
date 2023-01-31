"use strict";
const chunk = require("@core/chunk");

const hex2bin = (hex) => {
    return parseInt(hex, 16).toString(2).padStart(8, "0");
};

const bin2hex = (bin) => {
    return parseInt(bin, 2).toString(16).padStart(2, "0");
};

const decode = (varbindValue, offset = 0) => {
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
    // we increase this with each binary character, and use it to reference the vlan ID
    let vlanIndex = 0;

    // this is where we'll put the results array
    const result = [];

    // iterate through the chunked hex values
    for (let eachChunk of chunkedHex) {
        // convert it to binary (eg '00010100')
        const binaryString = hex2bin(eachChunk);
        // iterate through each character in 8-bit binary string
        for (let eachChar of binaryString) {
            if (eachChar === "1") {
                result.push(vlanIndex + offset);
            }
            vlanIndex += 1;
        }
    }

    return result;
};

const encode = (vlanArray, sliceSize = 4096, delimiter = " ") => {
    const hexArray = [];

    if (4096 % sliceSize !== 0) {
        throw new Error(`sliceSize ${sliceSize} is invalid - it should be a factor of 4096`);
    }

    for (let groupIndex = 0; groupIndex < 513; groupIndex++) {
        let binaryString = "";
        for (let chunkIndex = 1; chunkIndex < 9; chunkIndex++) {
            const vlanIndex = chunkIndex + groupIndex * 8;
            binaryString += vlanArray.includes(vlanIndex) ? "1" : "0";
        }
        hexArray.push(bin2hex(binaryString));
    }

    const outputArray = [];
    const slicesCount = 4096 / sliceSize; // 4
    for (let a = 0; a < slicesCount; a++) {
        const startValue = (a * sliceSize) / 8;
        const endValue = ((a + 1) * sliceSize) / 8;
        outputArray.push(hexArray.slice(startValue, endValue).join(delimiter));
    }
    return outputArray;
};

module.exports = {
    encode,
    decode,
};
