"use strict";

/**
 * core/heap-size.js
 * Get's the heap size in MB for debug.
 * 0.0.1 01/12/2022 - Created first version (RM2)
 */

const v8 = require("v8");

module.exports = (logger) => {
    const heapSize = v8.getHeapStatistics().total_available_size / 1024 / 1024;

    //Print the heap size
    if (logger) {
        logger.info(`Heap size is ${Math.round(heapSize * 10) / 10}MB.`);
    }

    return heapSize;
};
