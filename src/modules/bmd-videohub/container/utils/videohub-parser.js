"use strict";

module.exports = parser;

function parser(str) {
    let returnBlocks = [];

    // split into lines
    const strLines = str.split("\n");

    let blockTitle = null;
    let blockData = {};
    let previousLine = null;
    for (let eachLine of strLines) {
        if ((previousLine === null || previousLine.trim() === "") && blockTitle === null && eachLine.endsWith(":")) {
            blockTitle = normalizeTitle(eachLine);
        } else if (eachLine.trim() === "") {
            if (blockTitle) {
                // if it's empty then it's end of block
                returnBlocks.push({
                    title: blockTitle,
                    data: blockData,
                });
                // reset in case there's more ...
                blockTitle = null;
                blockData = {};
            }
        } else {
            // probably content
            // split by spaces, and see if the first value is numerical
            const eachLineSpaceArray = eachLine.split(" ");
            if (!isNaN(eachLineSpaceArray[0])) {
                // it's a number/value type
                blockData[parseInt(eachLineSpaceArray[0])] = eachLine.substring(eachLine.indexOf(" ") + 1);
            } else {
                const eachLineColonArray = eachLine.split(":");
                if (eachLineColonArray.length === 2) {
                    const lowerName = eachLineColonArray[0].toLowerCase().replace(/\ /g, "_").trim();
                    blockData[lowerName] = eachLineColonArray[1].trim();
                } else {
                    blockData = eachLine;
                }
            }
        }
        previousLine = eachLine;
    }
    return returnBlocks;
}

function normalizeTitle(title) {
    return title.toLowerCase().replace(/\ /g, "_").replace(":", "");
}
