"use strict";
const mongoSingle = require("@core/mongo-single");

module.exports = async (router, routesCollection) => {

    // this always returns a 1-based result. Gah.
    console.log(`fetch-routes: fetching routes from device ... `);
    const routerState = await router.getState();

    if (routerState.message) {
        console.log(`fetch-routes: error fetching routes: ${routerState?.message}`);
    }
    else {
        let routes = [];

        // get the array matrix keys
        const matrix = Object.keys(routerState);

        // and the 1-based array of levels (assuming there's only one matrix)
        const levels = Object.keys(routerState[matrix[0]]);
        for (let level of levels) {
            const intLevel = parseInt(level)
            const destinations = Object.keys(routerState[matrix[0]][level]);
            if (Array.isArray(destinations)) {
                for (let destination of destinations) {
                    if (routerState[matrix]?.[level]?.[destination] !== undefined) {
                        // destinations are all zero-based ... but not here. AGGGGHHHHH!
                        const destinationZero = parseInt(destination) - 1;

                        if (!routes[destinationZero]) {
                            routes[destinationZero] = { destination: destinationZero, levels: {} };
                        }
                        // now we've guaranteed the levels key is there we can populate it
                        routes[destinationZero]["levels"][intLevel] = routerState[matrix]?.[level]?.[destination];
                        routes[destinationZero]["timestamp"] = Date.now();
                    }
                }
            }
        }

        console.log(`fetch-routes: updating routes database with ${routes.length} route(s)`);

        for (let route of routes) {
            if (route) {
                const query = { destination: route?.destination };
                const update = {
                    $set: route,
                };
                const options = { upsert: true };
                await routesCollection.updateOne(query, update, options);
            }
        }
    }
};