"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");
const delay = require("delay");

module.exports = async (layout) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`deviceconfig-setlayout: failed to fetch config`);
        return false;
    }

    const layoutStrings = {
        "2x2": {
            uk: "0 0\n1 2\n2 1\n3 3\n",
            us: "0 0\n1 1\n2 2\n3 3\n",
        },
        "3x3": {
            uk: "0 0\n1 3\n2 6\n3 1\n4 4\n5 7\n6 2\n7 5\n8 8\n9 6\n",
            us: "0 0\n1 1\n2 2\n3 3\n4 4\n5 5\n6 6\n7 7\n8 8\n9 9\n",
        },
        "4x4": {
            uk: "0 0\n1 4\n2 8\n3 12\n4 1\n5 5\n6 9\n7 13\n8 2\n9 6\n10 10\n11 14\n12 3\n13 7\n14 11\n15 15\n",
            us: "0 0\n1 1\n2 2\n3 3\n4 4\n5 5\n6 6\n7 7\n8 8\n9 9\n10 10\n11 11\n12 12\n13 13\n14 14\n15 15\n",
        },
    };

    let routingString = "";
    if (layoutStrings?.[layout]?.[config.autolayout] !== undefined) {
        // we're going to move the input/outputs around
        routingString = layoutStrings?.[layout]?.[config.autolayout];
    }

    try {
        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();

        // send the new layout command
        await router.send("CONFIGURATION", `layout: ${layout}`, true);

        if (routingString) {
            // let it catch up
            await delay(1000);

            // then do the new layout
            await router.send("VIDEO OUTPUT ROUTING", routingString, true);
        }
        return true;
    } catch (error) {
        console.log("deviceconfig-setlayout: ", error);
        return false;
    }
};
