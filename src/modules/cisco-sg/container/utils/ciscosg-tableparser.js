"use strict";

module.exports = (source) => {

    const parseRow = (row, colPositions) => {
        const results = [];
        for (let eachCol of colPositions) {
            let header = row.substr(eachCol.start, eachCol.length);
            header = header.trim()
            header = header.replace(" ", "_");
            header = header.toLowerCase();
            results.push(header);
        }
        return results;
    }

    const processMultiline = (multilineData, headers) => {
        const rowData = [];
        for (let eachIndex in headers) {
            let columnText = "";
            for (let eachLine of multilineData) {
                columnText += eachLine[eachIndex].trim();
            }
            rowData.push(columnText);
        }
        return rowData;
    }

    const rows = source.split("\n");

    let previousRow = null;
    const colPositions = [];
    let headers = [];
    const rowResultsArray = [];
    let multiline = [];

    // so we're looking for a load of dashes, which show the top of the table
    for (let eachRow of rows) {
        if (eachRow.startsWith("--")) {
            // header row
            eachRow = eachRow.trim();

            // calculate the col positions
            const colArray = eachRow.split(" ");
            let runningPosition = 0;
            for (let eachCol of colArray) {
                colPositions.push({
                    start: runningPosition,
                    length: eachCol.length
                });
                runningPosition += eachCol.length + 1;
            }

            // fetch the headers
            headers = parseRow(previousRow, colPositions);
        }
        else if (headers.length > 0) {
            // we're probably into the contents of the table
            let row = parseRow(eachRow, colPositions);
            if (row && row.length > 0) {
                if (row[0] === "") {
                    // there's nothing in column one - it must be a multi-line row
                    // we'll save it for next time
                    multiline.push(row);
                }
                else {
                    // we have something in column 1
                    if (multiline.length > 0) {
                        // before we process this line, let's deal with any previous multiline stuff
                        rowResultsArray.push(processMultiline(multiline, headers));
                        multiline = [];
                    }
                    // now we can process this line
                    multiline.push(row);
                }
            }
        }
        previousRow = eachRow;
    }
    rowResultsArray.push(processMultiline(multiline, headers));

    // lastly we use the headers to make row objects
    const results = [];
    for (const eachRowResult of rowResultsArray) {
        const result = {};
        for (let eachIndex in headers) {
            result[headers[eachIndex]] = eachRowResult[eachIndex];
        }
        results.push(result);
    }
    return results;
}

