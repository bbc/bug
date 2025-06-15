"use strict";
const mongoSingle = require("@core/mongo-single");

module.exports = async (router, routesCollection) => {

    // this always returns a 1-based result. Gah.
    const routerState = await router.getState();
    if (routerState.message) {
        console.log(`worker-swp08: error fetching routes: ${routerState?.message}`);
    }
    else {
        let entries = [];

        // get the array matrix keys
        const matrix = Object.keys(routerState);

        // and the 1-based array of levels (assuming there's only one matrix)
        const levels = Object.keys(routerState[matrix[0]]);
        for (let level of levels) {
            const destinations = Object.keys(routerState[matrix[0]][level]);
            if (Array.isArray(destinations)) {
                for (let destination of destinations) {
                    if (!entries[parseInt(destination)]) {
                        entries[parseInt(destination) - 1] = { destination: parseInt(destination) - 1, levels: {} };
                    }

                    // AGGGHHH the destination is ALWAYS zero based. FFS Ross!
                    entries[parseInt(destination) - 1]["levels"][level] = routerState[matrix][level][destination];
                    entries[parseInt(destination) - 1]["timestamp"] = Date.now();
                }
            }
        }


        for (let entry of entries) {
            if (entry) {
                const query = { destination: entry?.destination };
                const update = {
                    $set: entry,
                };
                const options = { upsert: true };
                await routesCollection.updateOne(query, update, options);
            }
        }
    }
};


