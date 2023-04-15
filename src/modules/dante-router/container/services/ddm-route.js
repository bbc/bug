"use strict";

const configGet = require("@core/config-get");

module.exports = async (destinatonIndex, sourceIndex) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`ddm-route: failed to fetch config`);
        return false;
    }

    try {
        return true;
    } catch (error) {
        console.log("ddm-route: ", error);
        return false;
    }
};
