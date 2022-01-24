"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");

module.exports = async (destinatonIndex, sourceIndex) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`videohub-route: failed to fetch config`);
        return false;
    }

    try {
        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send("VIDEO OUTPUT ROUTING", `${destinatonIndex} ${sourceIndex}`);
        return true;
    } catch (error) {
        console.log("videohub-route: ", error);
        return false;
    }
};
