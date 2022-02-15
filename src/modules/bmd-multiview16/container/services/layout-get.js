"use strict";

const configGet = require("@core/config-get");
const mongoSingle = require("@core/mongo-single");
const deviceConfigList = require("./deviceconfig-list");
const sourceList = require("./source-list");
const routeList = require("./route-list");

module.exports = async () => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`deviceconfig-list: failed to fetch config`);
        return false;
    }

    const layoutArray = [];
    const deviceConfig = await deviceConfigList();
    const sources = await sourceList();
    const routes = await routeList();

    if (deviceConfig && sourceList && routes) {
        const colCount = parseInt(deviceConfig?.layout.substring(0, 1));
        const rowCount = parseInt(deviceConfig?.layout.substring(2, 3));

        // loop through colCount
        let cellIndex = 0;
        for (let col = 0; col < colCount; col++) {
            for (let row = 0; row < rowCount; row++) {
                if (layoutArray[row] === undefined) {
                    layoutArray[row] = [];
                }
                layoutArray[row][col] = {
                    outputIndex: cellIndex,
                    inputIndex: routes[cellIndex],
                    inputLabel: sources[cellIndex],
                    soloSelected: deviceConfig?.solo_enabled && routes[16] === routes[cellIndex],
                    audioSelected: routes[17] === routes[cellIndex],
                };
                cellIndex += 1;
            }
        }
    }
    return layoutArray;
};
