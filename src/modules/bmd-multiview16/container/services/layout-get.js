"use strict";

const configGet = require("@core/config-get");
const deviceConfigList = require("./deviceconfig-list");
const sourceList = require("./source-list");
const routeList = require("./route-list");
const logger = require("@utils/logger")(module);

module.exports = async () => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        const layoutArray = [];
        const deviceConfig = await deviceConfigList();
        const sources = await sourceList();
        const routes = await routeList();

        if (deviceConfig && sources && routes && deviceConfig.layout) {
            const colCount = parseInt(deviceConfig.layout.substring(0, 1));
            const rowCount = parseInt(deviceConfig.layout.substring(2, 3));

            let cellIndex = 0;
            for (let col = 0; col < colCount; col++) {
                for (let row = 0; row < rowCount; row++) {
                    if (!layoutArray[row]) {
                        layoutArray[row] = [];
                    }

                    layoutArray[row][col] = {
                        outputIndex: cellIndex,
                        inputIndex: routes[cellIndex],
                        inputLabel: sources[cellIndex],
                        soloSelected: deviceConfig.solo_enabled && routes[16] === routes[cellIndex],
                        audioSelected: routes[17] === routes[cellIndex],
                    };

                    cellIndex += 1;
                }
            }
        }

        return layoutArray;

    } catch (err) {
        err.message = `layout-get: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
