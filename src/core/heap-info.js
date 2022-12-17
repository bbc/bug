"use strict";

/**
 * core/heap-info.js
 * Get's the heap size in MB for debug.
 * 0.0.1 01/12/2022 - Created first version (RM2)
 */

const v8 = require("v8");

module.exports = (logger) => {
    const heap = v8.getHeapStatistics();

    //Print the heap size
    if (logger) {
        logger.debug(`heap-info: Heap size is ${Math.round(heap?.total_available_size / 1024 / 1024)}MB.`);
        logger.debug(
            `heap-info: ${Math.round(heap?.used_heap_size / 1024 / 1024)}MB of the heap is used. Usage is ${Math.round(
                (heap?.used_heap_size / heap?.total_available_size) * 100
            )}%`
        );
    }

    return heap;
};
